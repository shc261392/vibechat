# Contributing to VibeChat

Thank you for your interest in contributing to VibeChat! We welcome all contributions, whether they are bug fixes, feature additions, documentation improvements, or anything else.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/vibechat.git
   cd vibechat
   ```
3. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

1. **Create your changes** in your feature branch
2. **Follow the code style** (ESLint + Prettier)
3. **Write or update tests** if applicable
4. **Test your changes** locally:
   ```bash
   npm run dev
   ```
5. **Commit with conventional commits**:
   ```
   git commit -m "feat: add new feature"
   ```

## Commit Message Format

We follow conventional commits. Format your commit messages as:

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat(chat): add message history pagination`
- `fix(capture): improve screenshot quality on linux`
- `docs: update installation instructions`

## Reporting Issues

Before opening an issue, please check if it already exists. When reporting a bug:

1. **Describe the bug** clearly
2. **Steps to reproduce** the issue
3. **Expected behavior**
4. **Actual behavior**
5. **System information** (OS, Node version, etc.)

## Pull Request Process

1. **Update README.md** if needed
2. **Add/update tests** for new functionality
3. **Ensure tests pass**: `npm test`
4. **Keep commits clean** with meaningful messages
5. **Request review** and be open to feedback

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use Prettier for formatting

## Questions or Need Help?

Feel free to open a discussion on GitHub or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the GPL-3.0 license.

---

Happy coding! 🌈
