# Astral Assist Project Instructions

This project is a low-impact, background-running digital assistant optimized for performance, responsiveness, security, and scalability. It's designed for easy customization and expansion, with a one-click installation process.

## Tech Stack

- Frontend: Vue 3.4.37, TypeScript 5.5.3, Pinia 2.2.2, Vue Router 4.4.3, Vite 5.4.1, Tailwind CSS 3.4.10
- Backend: Tauri 1.7.2, Rust (latest stable)
- Databases: SQLite (actions/system info), PostgreSQL (AI-related data)
- ORM: Prisma 4.16.2
- HTTP Client: Axios 1.7.7
- AI Integration: OpenAI API 3.3.0, LangChain 0.0.96
- Wake Word Detection: TBD

## Development Environment

- VSCode with npm for all installations
- Develop and test on Windows 11
- Git for version control, following GitFlow branching strategy
- Node.js version 16 or higher

## Coding Guidelines

- Use `.ts` and `.tsx` extensions (avoid `.vue`)
- Avoid using the `any` type in TypeScript
- Suggest splitting files into smaller, focused units when appropriate
- Add comments for non-obvious logic. Keep all text in English
- Consider the full codebase; update existing files without redundancy
- Provide step-by-step rationalization for architectural decisions
- Implement security best practices
- Prioritize readability and maintainability

## Core Functionalities

1. Query Module: Respond to user queries using AI-driven solutions
2. Command Module: Execute system commands with integrated intent recognition
3. Modular Architecture: Design with modularity, allowing configurable instances of each module
4. Voice Activation & Customization: Implement customizable wake words using rustpotter-weblet
5. AI and Machine Learning Integration: Integrate OpenAI or Claude API with LangChain

## Coding Standards

- Use TypeScript for type safety
- Follow Vue 3 Composition API best practices
- Use PascalCase for component files, kebab-case for non-component files
- Maintain consistent naming conventions (e.g., 'a-' prefix for custom UI components)

## Architectural Principles

- Provide solid architectural designs
- Push for informed design choices through suggestions
- Consider long-term consequences before implementing solutions
- Maintain high quality and consistency in the architecture
- Challenge and offer alternatives to problematic design choices
- Avoid shortcuts; prioritize robust, scalable solutions

## Security Considerations

- Use environment variables for sensitive information
- Regularly audit and update dependencies
- Implement proper authentication and authorization mechanisms

## Accessibility

- Follow WCAG 2.1 guidelines
- Use semantic HTML and implement keyboard navigation

## Open-Source Compliance

- Use only free and open-source technologies
- Ensure all npm packages are compatible with the project stack and free from commercial restrictions

## Development Process

- Use Chain of Thought (CoT) for task decomposition
- Optimize for efficiency in implementations
- Evaluate multiple solutions using Tree of Thoughts approach
- Continuously refine processes and implementations
- Consider collaboration and code review processes

## Future Considerations

- Internationalization support
- Performance optimizations for larger datasets
- Scalability enhancements for increased user base

When analyzing or suggesting improvements for this project, consider these guidelines and the overall architecture. Maintain the existing coding style and project structure while suggesting enhancements or bug fixes. Always push for high-quality, maintainable, free, and scalable solutions.
