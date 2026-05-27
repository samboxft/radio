# Wavelength Radio — Deploy Guide (no Netlify required)

Netlify out of credits? Use **Vercel** (recommended) or **GitHub Pages + Google Apps Script** (100% free, no host credits).

---

## Option A — Vercel (recommended, Gemini built-in)

Your project already includes `api/gemini-intro.js` — Vercel runs it automatically.

### Steps

1. Create a free account at [vercel.com](https://vercel.com).
2. Install CLI (optional): `npm i -g vercel`
3. In this folder, run:
   ```bash
   cd c:\Users\Administrator\radio2
   vercel
   ```
   Follow prompts (link account, project name, default settings OK).
4. Add environment variable:
   - Vercel dashboard → your project → **Settings** → **Environment Variables**
   - Name: `GEMINI_API_KEY`
   - Value: your key from [Google AI Studio](https://aistudio.google.com/apikey)
   - Apply to **Production**
5. Redeploy: **Deployments** → ⋮ on latest → **Redeploy**

### Or deploy without CLI

1. Push this folder to a **GitHub** repo (public or private).
2. [vercel.com/new](https://vercel.com/new) → **Import** that repo.
3. Add `GEMINI_API_KEY` as above → Deploy.

Live URL example: `https://wavelength-radio.vercel.app`

Gemini proxy path: **`/api/gemini-intro`** (same as Netlify).

---

## Option B — GitHub Pages + Google Apps Script (no Vercel/Netlify credits)

Host the radio as static files only; Gemini runs on Google’s free Apps Script.

### Part 1 — Static site (GitHub Pages)

1. Create repo `wavelength-radio` on GitHub.
2. Upload **all files** from this folder (at least `index.html`, `vercel.json` optional).
3. **Settings** → **Pages** → Source: branch `main`, folder `/ (root)`.
4. Site URL: `https://YOUR_USERNAME.github.io/wavelength-radio/`

Gemini will show **fallback mode** until you complete Part 2.

### Part 2 — Free Gemini proxy (Apps Script)

1. Open [script.google.com](https://script.google.com) → **New project**.
2. Replace `Code.gs` with the contents of `google-apps-script/GeminiProxy.gs` in this repo.
3. **Project settings** (gear) → **Script properties** → Add:
   - Property: `GEMINI_API_KEY`
   - Value: your AI Studio key
4. **Deploy** → **New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`).

### Part 3 — Connect proxy to your site

On your live GitHub Pages URL, open the browser console (F12) and run:

```javascript
localStorage.setItem('wv_gemini_proxy_url', 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE');
location.reload();
```

Top bar should change to **`Gemini: connected`**.

---

## Option C — Cloudflare Pages (static + Workers, advanced)

1. [pages.cloudflare.com](https://pages.cloudflare.com) → Create project → connect GitHub or upload folder.
2. Build: none; output directory: `/` (root).
3. For Gemini you still need a Worker or use **Option B** Apps Script URL in `localStorage` as above.

---

## What does NOT work for Gemini

| Host | Gemini stories / hourly pick |
|------|------------------------------|
| GitHub Pages alone | No — use Apps Script URL (Option B) |
| Surge / raw file open | No — use Vercel or Apps Script |
| Netlify (no credits) | Skip — use Vercel or Option B |

---

## Environment variable

| Name | Where |
|------|--------|
| `GEMINI_API_KEY` | Vercel dashboard **or** Apps Script **Script properties** |

Never put the key inside `index.html`.

---

## Quick test after deploy

1. Open site → click **Play**.
2. Top right: **`Gemini: connected`** (not “fallback mode”).
3. Nova should speak a longer **story** segment after the short intro.
4. Like/dislike a track — “Taste memory” text should update.

---

## Other deploy notes

See rest of this file for adding songs, licenses, taste learning, and hourly spotlight behavior.
