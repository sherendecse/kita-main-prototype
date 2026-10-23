# Kita Main — Eligibility Demo

A static website using HTML, CSS and JavaScript. No installation, API key or build step is required.

## Upload to GitHub

1. Extract this ZIP on your computer.
2. Create or open your GitHub repository.
3. Choose **Add file → Upload files**.
4. Upload the extracted files (not the ZIP) to the repository root. `index.html` must be at the root.
5. Commit the files.
6. To host it with GitHub Pages: open **Settings → Pages**, select **Deploy from a branch**, then select **main** and **/ (root)** and save. GitHub shows the published URL when deployment completes.

## Files

- `index.html`: dashboard and page structure.
- `style.css`: responsive red-and-blue styling.
- `engine.js`: the 10 fictional households and eligibility / duplicate checks.
- `app.js`: form submission, table, editing, deletion with Undo, search, filters and CSV export.
- `.nojekyll`: serves these static files directly on GitHub Pages.

## Run locally

Open `index.html` in your browser, or serve this folder with `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Demo behavior

- Assessment date is fixed at **23 October 2026**.
- The initial 10 records produce **4 Qualified, 4 Not qualified and 2 Needs review**.
- New submissions appear in the table immediately.
- Edit and delete controls update eligibility, counts and duplicate flags.
- Duplicate detection compares normalized household IDs and phone numbers.
- All changes exist only in the current page session and reset on refresh. There is no shared database or backend.
- All included records are fictional, and benefit/PPR statuses are simulated.
- These prototype rules remain subject to YGG confirmation. No live government verification is performed.

This ZIP contains the portable website code, without Sites hosting configuration or credentials.
