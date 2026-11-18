# Changelog

## [4.2.16] - 2026-11-18

### Changed

- The "open in editor" button in the error overlay now launches the editor through `launch-editor` instead of `react-dev-utils`. The endpoint, its query parameters and `REACT_EDITOR` behave as before. `REACT_EDITOR=none` still turns the button off. What differs: VS Code now reuses the current window when it opens a file; vim and emacs are opened at the column as well as the line; more editors are detected when `REACT_EDITOR` is not set (Cursor, Zed and others); `LAUNCH_EDITOR` is also read; and the Windows command-injection and UNC-path fixes in `launch-editor` 2.14.2 apply.
- Installs no longer pull in `react-dev-utils` and its 24 dependencies, which removes the `picomatch` audit finding from the runtime dependency tree.
