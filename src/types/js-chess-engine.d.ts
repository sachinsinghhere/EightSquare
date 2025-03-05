declare module 'js-chess-engine' {
  export interface GameState {
    isFinished: boolean;
    checkMate: boolean;
    pieces: {
      [key: string]: string;
    };
  }

  export class Game {
    constructor();
    move(from: string, to: string): void;
    aiMove(level?: number): { [key: string]: string };
    exportJson(): GameState;
    reset(): void;
  }
} 