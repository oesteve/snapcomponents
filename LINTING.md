# Linting

This project uses ESLint for linting JavaScript and TypeScript code, and Prettier for code formatting.

## ESLint

ESLint is configured in the `eslint.config.js` file in the root of the project. It is set up to lint JavaScript, TypeScript, and React code.

### Running ESLint

To run ESLint on the project, use the following npm scripts:

```bash
# Check for linting issues
npm run lint

# Automatically fix linting issues where possible
npm run lint:fix
```

These commands will run ESLint on all JavaScript, JSX, TypeScript, and TSX files in the `assets` directory.

## Prettier

Prettier is used for consistent code formatting. It is configured in the `.prettierrc` file in the root of the project.

### Running Prettier

To run Prettier on the project, use the following npm scripts:

```bash
# Check for formatting issues
npm run format

# Automatically fix formatting issues
npm run format:fix
```

These commands will run Prettier on all JavaScript, JSX, TypeScript, TSX, CSS, Markdown, and JSON files in the `assets` directory.

## PHP Code Style

For PHP code, the project uses PHP CS Fixer, which is configured in the `.php-cs-fixer.dist.php` file.

## Pre-commit Hooks

Consider setting up pre-commit hooks to automatically run linting and formatting before committing changes. This can help ensure that all code committed to the repository follows the project's coding standards.
