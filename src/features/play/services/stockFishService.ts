import axios from "axios";

// Define API Response Type
interface StockfishApiResponse {
    success: boolean;
    evaluation: number;
    mate: null | string;
    bestmove: string;
    ponder: string;
    continuation: string;
}

// Define Custom Response Type
interface ModifiedResponse {
    success: boolean;
    evaluation: number;
    mate: null | string;
    bestmove: string;
    ponder: string;
    continuation: string[];
    error?: string;
}

// Common Function to Call Stockfish API
export async function stockfishAnalysis(fen: string, depth: number = 12): Promise<ModifiedResponse> {
    try {
        const apiUrl = "https://stockfish.online/api/s/v2.php"; 
        const response = await axios.get<StockfishApiResponse>(apiUrl, {
            params: {
                fen,
                depth
            }
        });

        const data = response.data;

        // Extract bestmove and ponder from the bestmove string
        const bestMoveParts = data.bestmove.split(' ');
        const bestMove = bestMoveParts[1] || '';
        const ponderMove = bestMoveParts[3] || '';

        // Convert continuation string to an array
        const continuationMoves = data.continuation ? data.continuation.split(' ') : [];

        // Modified Response
        const modifiedResponse: ModifiedResponse = {
            success: data.success,
            evaluation: data.evaluation,
            mate: data.mate,
            bestmove: bestMove,
            ponder: ponderMove,
            continuation: continuationMoves,
        };

        return modifiedResponse;
        
    } catch (error: any) {
        console.error("Stockfish API Error:", error.message);
        return { 
            success: false, 
            evaluation: 0,
            mate: null,
            bestmove: '',
            ponder: '',
            continuation: [],
            error: "API call failed" 
        };
    }
}



