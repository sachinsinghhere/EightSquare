# EightSquare Chess App 🎮

A modern and elegant chess application built with React Native, offering a seamless chess-playing experience with a beautiful user interface and powerful chess engine integration.

## Project Overview 📝

EightSquare combines the power of modern web technologies with classic chess gameplay, providing users with an intuitive and engaging platform to play, learn, and enjoy chess.

## Project Structure 📂

```
.
├── src/
│   ├── assets/        # 🖼️ Images, icons, and other static assets
│   ├── features/      # ⚙️ Feature-based modules
│   ├── navigation/    # 🧭 Navigation configuration
│   ├── shared/        # 🔄 Shared components and utilities
│   ├── types/         # 📝 TypeScript type definitions
│   └── utils/         # 🛠️ Utility functions and helpers
├── App.tsx           # 📱 Root application component
└── index.js         # 📍 Application entry point
```

## Technologies Used 🚀

- React Native
- TypeScript
- React Navigation
- Chess.js
- JS Chess Engine

## Getting Started 🏁

1. Install dependencies:
```bash
yarn install
```

2. Install iOS dependencies (iOS only):
```bash
cd ios && bundle install && bundle exec pod install && cd ..
```

3. Start the development server:
```bash
yarn start
```

4. Run the app:
```bash
# For iOS
yarn ios

# For Android
yarn android
```

## Development Guidelines 📋

- Written in TypeScript for enhanced type safety
- Follows functional programming principles
- Uses React hooks for state management
- Implements proper error handling
- Focuses on performance optimization

## Credits and Acknowledgments 🙏

This project wouldn't be possible without these amazing open-source projects and resources:

- [chess.js](https://github.com/jhlywa/chess.js) - Chess move validation and game state management
- [js-chess-engine](https://github.com/josefjadrny/js-chess-engine) - Chess engine implementation
- [lichess](https://lichess.org/) - Inspiration for UI/UX and chess features
- [chess.com](https://www.chess.com/) - Inspiration for modern chess app design

## License 📄

MIT

---

For more information about React Native development, visit the [official documentation](https://reactnative.dev/).
