import axios, {AxiosError} from 'axios';
import type {AIPersona} from '../screens/AIPersonaScreen';

type GamePhase = 'opening' | 'middlegame' | 'endgame';

interface CommentaryResponse {
  commentary: string;
}

// Helper function to get piece name from move notation
function getPieceName(move: string, gameState: any): string {
  try {
    const state = JSON.parse(gameState);
    const pieces = state.pieces || {};
    const [from] = move.split('-');
    const piece = pieces[from.toUpperCase()];
    
    if (!piece) return 'piece';
    
    const pieceMap: Record<string, string> = {
      'p': 'pawn',
      'n': 'knight',
      'b': 'bishop',
      'r': 'rook',
      'q': 'queen',
      'k': 'king'
    };
    
    return pieceMap[piece.toLowerCase()] || 'piece';
  } catch (e) {
    return 'piece';
  }
}

export async function generateCommentary(
  persona: AIPersona,
  gameState: string,
  playerMove: string,
  aiMove: string | null,
  gamePhase: GamePhase,
): Promise<CommentaryResponse> {
  const playerPiece = getPieceName(playerMove, gameState);
  const aiPiece = aiMove ? getPieceName(aiMove, gameState) : null;

  // Construct the prompt for expert chess commentary
  const prompt = `
**Role**: You're an expert chess commentator analyzing the current position.

**Context**: 
- Game phase: ${gamePhase}
- Last move: ${playerPiece} move
${aiMove ? `- Response: ${aiPiece} move` : ''}

**Task**: Provide engaging expert commentary on the current position.

**Guidelines**:
1. Be insightful and engaging
2. Keep response to max 20 words
3. Focus on positional understanding
4. No specific moves or suggestions
5. No chess notation or coordinates
6. No timing references

**Response Format**: 
{
  "commentary": "your expert commentary here"
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: {type: 'json_object'},
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          'HTTP-Referer': 'https://openrouter.ai/api/v1',
          'Content-Type': 'application/json',
        },
      },
    );

    let result: { commentary: string };
    try {
      result = JSON.parse(response.data.choices[0].message.content);
      if (!result.commentary) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      // If JSON parsing fails, use the raw response
      const rawText = response.data.choices[0].message.content;
      result = {
        commentary: rawText.trim(),
      };
    }

    return {
      commentary: result.commentary,
    };
  } catch (error) {
    console.error('API Error:', (error as AxiosError).response?.data || (error as Error).message);
    // Return fallback commentary
    const fallbackCommentaries = {
      opening: "Position shows typical opening themes with focus on development.",
      middlegame: "Complex position with interesting strategic possibilities.",
      endgame: "Critical endgame position requiring precise calculation.",
    };
    
    return {
      commentary: fallbackCommentaries[gamePhase] || "Interesting position with chances for both sides.",
    };
  }
}
