# Repository Agent Guidelines

## Git Commit Rules

- **Commit on New Features**: Whenever a new feature is added and completed, you MUST stage the modified and newly created files and create a Git commit before finishing your task.
- **Stage Relevant Files Only**: Check `git status` before committing and stage only the files related to the feature or change (avoid staging unrelated or temporary files).
- **Conventional Commits**: Format all commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification to match the repository's history:
  - `feat: <concise summary of the new feature>`
  - `fix: <concise summary of the bug fix>`
  - `refactor: <concise summary of the refactoring>`
  - `chore: <concise summary of maintenance/config changes>`
  - Keep the subject line imperative, lowercase after the prefix, and without a trailing period.
