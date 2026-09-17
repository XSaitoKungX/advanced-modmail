# Changelog

All notable changes to this project will be documented in this file.

The format follows the principles of Keep a Changelog and the project intends to use Semantic Versioning once releases begin.

## [Unreleased]

### Added

- Initial repository governance and project-foundation documentation.
- TypeScript application toolchain: strict TypeScript 7 build, ESLint flat config, Prettier, Vitest, pnpm lockfile, and CI workflow.
- Application architecture skeleton: `domain`, `application`, `infrastructure`, `transport`, and `presentation` layers under `src/` with lint-enforced dependency boundaries.

### Changed

- Replaced the preliminary five-layer `src/` skeleton (`domain`, `application`, `infrastructure`, `transport`, `presentation`) with a Discord-native modular project structure; separation-of-concerns requirements are retained through module responsibilities instead of layer folders (see `docs/adr/0001-discord-native-project-structure.md`).
- Moved the planned application entry point to repository-root `index.ts` (`dist/index.js`).
- Replaced the layer-specific ESLint boundary rules with a lint rule centralizing `process.env` access under `src/config/`.

No versioned release has been published yet.
