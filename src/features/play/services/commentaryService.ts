import axios, {AxiosError} from 'axios';
import type {AIPersona} from '../screens/AIPersonaScreen';

type GamePhase = 'opening' | 'middlegame' | 'endgame';

interface CommentaryResponse {
  text: string;
  textWithoutEmoji: string;
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

  // Construct the prompt using persona data
  const prompt = `
**Role**: You're ${persona.name}, a ${persona.personality.style.toLowerCase()} chess player.
Your strength is ${persona.personality.strength} but you tend to ${persona.personality.weakness}.

**Context**: 
- Game phase: ${gamePhase}
- Player moved their ${playerPiece}
${aiMove ? `- You responded with your ${aiPiece}` : ''}

**Task**: ${aiMove 
  ? `React to the player's ${playerPiece} move and explain your ${aiPiece} response in a casual, conversational way.` 
  : `React to the player's ${playerPiece} move in a casual, conversational way.`}

**Guidelines**:
1. Be conversational and natural, like a friend playing chess
2. Include 1-2 relevant emojis in the emoji version
3. Keep your response to 10-15 words
4. Match your ${persona.personality.style.toLowerCase()} personality
5. Never use chess notation or coordinates
6. Never mention time, clock, or speed of moves
7. Use these as tone examples: ${persona.commentary[gamePhase].join(', ')}

**Response Format**: 
{
  "withEmoji": "your comment with emojis",
  "withoutEmoji": "same comment without emojis"
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        // model: 'google/gemini-2.0-flash-001',
        // model: 'deepseek/deepseek-r1-distill-llama-8b',
        // model: 'meta-llama/llama-3.2-1b-instruct',
        model: 'meta-llama/llama-3.1-70b-instruct',
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

    let commentary: { withEmoji: string; withoutEmoji: string };
    try {
      commentary = JSON.parse(response.data.choices[0].message.content);
      if (!commentary.withEmoji || !commentary.withoutEmoji) {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      // If JSON parsing fails, use the raw response
      const rawText = response.data.choices[0].message.content;
      commentary = {
        withEmoji: rawText,
        withoutEmoji: rawText.replace(/[\u{1F600}-\u{1F6FF}]/gu, '').trim(),
      };
    }

    return {
      text: commentary.withEmoji,
      textWithoutEmoji: commentary.withoutEmoji,
    };
  } catch (error) {
    console.error('API Error:', (error as AxiosError).response?.data || (error as Error).message);
    // Return fallback commentary from persona's static responses
    const fallbackText = persona.commentary[gamePhase][
      Math.floor(Math.random() * persona.commentary[gamePhase].length)
    ];
    return {
      text: fallbackText,
      textWithoutEmoji: fallbackText.replace(/[\u{1F600}-\u{1F6FF}]/gu, '').trim(),
    };
  }
}

// // Example usage
// const tacticalTim = DIFFICULTY_LEVELS[1].personas[0];
// generateCommentary(
//   tacticalTim,
//   'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
//   'e5',
//   'middlegame',
// ).then(comment => {
//   console.log('With Emoji:', comment.text);
//   console.log('Without Emoji:', comment.textWithoutEmoji);
// });
