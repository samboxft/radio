# Option B — GitHub Pages + Google Apps Script (step by step)

No Netlify or Vercel credits needed.

---

## Part 1 — Google Apps Script (Gemini proxy) ~10 min

1. Open **[script.google.com](https://script.google.com)** → **New project**.
2. Delete any sample code in `Code.gs`.
3. Open `google-apps-script/GeminiProxy.gs` from this folder, copy **all** of it, paste into `Code.gs`, **Save** (Ctrl+S).
4. Click **Project settings** (gear) → **Script properties** → **Add script property**:
   - **Property:** `GEMINI_API_KEY`
   - **Value:** your key from [Google AI Studio](https://aistudio.google.com/apikey)
5. Click **Deploy** → **New deployment**:
   - Type: **Web app**
   - Description: `Wavelength Gemini`
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy** → authorize if asked → copy the **Web app URL** (must end with `/exec`).

Test in browser: open that URL. You should see JSON like `{"ok":true,"service":"Wavelength Gemini proxy"}`.

Keep that URL — you need it in Part 3.

---

## Part 2 — GitHub Pages (free static hosting) ~5 min

### Upload via GitHub website (no git required)

1. Go to **[github.com/new](https://github.com/new)** → name repo `wavelength-radio` → **Public** → Create.
2. Click **Add file** → **Upload files**.
3. Drag in from `c:\Users\Administrator\radio2`:
   - `index.html` (required)
   - `google-apps-script/` folder (optional, for reference)
   - `OPTION-B-SETUP.md`, `DEPLOY.md` (optional)
4. **Commit changes**.
5. **Settings** → **Pages** → **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** → folder **/ (root)** → **Save**
6. Wait 1–2 minutes. Your site will be at:
   `https://YOUR_GITHUB_USERNAME.github.io/wavelength-radio/`

---

## Part 3 — Connect Gemini on your live site

1. Open your GitHub Pages URL in Chrome/Edge.
2. In the right sidebar, find **Gemini setup (GitHub Pages)**.
3. Paste your Apps Script **Web app URL** (`.../exec`).
4. Click **Save URL & test Gemini**.
5. Top bar should show **`Gemini: connected`**.
6. Click **Play** — Nova should speak a short intro, then a longer Gemini **story** about the track.

The URL is saved in your browser (`localStorage`) — you only paste it once per device.

---

## Updating the station later

- Change music: edit `SONGS` in `index.html` on GitHub (edit file → commit).
- Change Apps Script: edit `Code.gs` → **Deploy** → **Manage deployments** → **Edit** (new version) → same Web app URL usually still works.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| `Gemini: fallback mode` | Wrong URL, or Script property `GEMINI_API_KEY` missing, or Web app not set to **Anyone** |
| CORS / network error | Redeploy Web app; use URL ending in `/exec`; click Save again |
| Authorization screen on first deploy | Normal — choose your Google account and allow |
| `/api/gemini-intro` 404 in Network tab | Expected on GitHub Pages — only Apps Script URL is used |

---

## Security

- Never commit your API key to GitHub.
- Key lives only in Apps Script **Script properties**.
- If a key was ever posted in chat, revoke it in AI Studio and create a new one.
