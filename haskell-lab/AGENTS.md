# Haskell Lab

## Locate the change

- Lesson text: data/topics.js
- Exercises and accepted answers: data/exercises.js
- Answer comparison: grading.js
- Saved progress and compatibility: storage.js
- Events and DOM updates: app.js
- Markup and appearance: index.html / styles.css

## Checks

Run from the repository root:

    npm test --prefix haskell-lab

Keep exercise IDs and the localStorage key stable. Restore old version-1 saves.
Use textContent for lesson text and feedback. Add a targeted test when changing
grading or persistence. Do not add dependencies or a build step for ordinary
content, style or logic edits.

## Publication

The canonical source is this directory in isikoro1/tools.
The public app is https://tools.isikoro.dev/haskell-lab/.
The existing automatic publication serves the repository's static assets.
Check the public HTML and module files after a main-branch change.
The earlier ChatGPT Sites copy is a separate snapshot.
