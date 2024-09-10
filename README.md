# Astral Assist

Astral Assist is a low-impact, background-running digital assistant optimized for performance, responsiveness, security, and scalability. It's designed for easy customization and expansion, with a one-click installation process.

## Tech Stack

- Frontend: Vue 3.4.37, TypeScript 5.5.3, Pinia 2.2.2, Vue Router 4.4.3, Vite 5.4.1, Tailwind CSS 3.4.10
- Backend: Tauri 1.7.2, Rust (latest stable)
- Databases: SQLite (actions/system info), PostgreSQL (AI-related data)
- ORM: Prisma 4.16.2
- HTTP Client: Axios 1.7.7
- AI Integration: OpenAI API 3.3.0, LangChain 0.0.96
- Wake Word Detection: rustpotter-weblet 3.0.3

## Project Setup

1. Clone the repository:

   ```
   git clone https://github.com/Maldayne/astral-assist.git
   cd astral-assist
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the necessary environment variables

4. Initialize the database:

   ```
   npx prisma migrate dev
   ```

5. Run the development server:
   ```
   npm run tauri dev
   ```

## Features

- Query Module: Respond to user queries using AI-driven solutions
- Command Module: Execute system commands with integrated intent recognition
- Modular Architecture: Designed for easy customization and expansion
- Voice Activation: Customizable wake words using rustpotter-weblet
- AI Integration: Utilizes OpenAI or Claude API with LangChain for intelligent responses

## Development Guidelines

- Use `.ts` and `.tsx` extensions for Vue components
- Implement Vue Composition API with `<script setup>`
- Follow TypeScript best practices, avoiding `any` types
- Use explicit file extensions in import statements
- Adhere to the project's coding standards and file naming conventions

## Testing

Run the test suite with:

```
npm run test
```

## Building for Production

To create a production build:

```
npm run build
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
