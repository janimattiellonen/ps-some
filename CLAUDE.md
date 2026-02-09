# Puskis Some

A web app for generating social media images for disc golf events.

## Tech Stack

- Vite
- React 19
- TypeScript
- StyleX for styling

## StyleX Notes

- Don't use shorthand border styles as they are not supported
- Use longhand properties instead: `borderWidth`, `borderStyle`, `borderColor`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

## Code Style

- Prefer `type` over `interface`
- Use type-only imports for types
- Avoid `any` - use proper types

Always use {}

DO:

````
    if (!file) {
      return;
    }
```

DON'T:

```
    if (!file) return;
```



# Git conventions

- use conventional commits
- when commiting changes, add changed files explicitly. Don't use `git add --all`.
- before commiting:
  - run `npm run lint` and fix problems. Changes should never be commited and pushed to github if
    the linter returns warnings or errors (IGNORE THIS FOR NOW, NOT INSTALLED)
  - run `npm run typecheck` before committing and fix any possible issues
  - run `npm run build` to catch StyleX errors and other build-time issues
  - run `npm run format`

# Communication Principles & Output Guidelines

- If unsure, ask, don't guess
- You are allowed to question my instructions or ideas, don't give unnecessary compliments
- Try to spot problems in my ideas. Provide solutions.
- Actionable Feedback: Provide specific, actionable suggestions.
- Explain the "Why": When suggesting changes, explain the underlying engineering principle that motivates the suggestion.
- Triage Matrix: Categorize significant issues to help the author prioritize:
  - [Critical/Blocker]: Must be fixed before merge (e.g., security vulnerability, architectural regression).
  - [Improvement]: Strong recommendation for improving the implementation.
  - [Nit]: Minor polish, optional.
- Be Constructive: Maintain objectivity and assume good intent.

# Design

- after implementing a new feature or fixing an issue:
  - run `npm run lint` and fix problems. Changes should never be committed and pushed to github if
    the linter returns warnings or errors (IGNORE THIS FOR NOW, NOT INSTALLED)
  - run `npm run typecheck` before committing and fix any possible issues
  - run `npm run build` to catch StyleX errors and other build-time issues
  - run `npm run format`
  - use agent `wcag-accessibility-auditor` to catch accessibility issues caused by the changes
````
