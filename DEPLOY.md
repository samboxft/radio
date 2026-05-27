# Wavelength Radio — Deploy & Setup Guide

## Go live in 3 steps

### 1. Deploy (GitHub Pages — free, permanent)
1. github.com/new → create public repo `wavelength-radio`
2. Upload `index.html`
3. Settings → Pages → Source: main branch → Save
4. Live at: `https://YOUR_USERNAME.github.io/wavelength-radio`

### 2. Get your free Mubert PAT (for the daily AI track)
1. Go to https://mubert.com/render — sign up free
2. Generate any track on the page
3. Open browser DevTools (F12) → Network tab
4. Find request to `api-b2b.mubert.com` → look for `pat` value in request body
5. Paste it into the "Mubert AI daily track" panel inside the radio station

Free Ambassador plan: 25 AI tracks/month (personal use).
Without a PAT, the station auto-falls back to a curated YouTube track.

### 3. Optional: Anthropic API key (for live AI host "Nova")
Nova calls the Anthropic API built into this chat environment.
For standalone deployment, add your key to index.html:

Find:  `headers:{'Content-Type':'application/json'},`
Add:   `'x-api-key':'YOUR_KEY', 'anthropic-version':'2023-06-01',`

Free trial credits at https://console.anthropic.com (no card needed).
Without a key, Nova uses pre-written fallback lines — station works fine.

---

## What's built

| Feature | How |
|---|---|
| 34 curated indie tracks | YouTube IFrame API (free) |
| No repeat in 24h | localStorage tracking, resets at midnight |
| AI host Nova | Anthropic Claude API |
| World news every hour | Google News RSS, no key needed |
| 5-min news broadcast | Music pauses, script displayed, returns automatically |
| Daily AI track | Mubert text-to-music API (free tier) |
| Daily curated fallback | Auto-selects if Mubert unavailable |
| Genre filter | 8 genre buttons rebuild the queue |
| AccuRadio-style layout | 3-column: queue / player+host / daily+news |

---

## Adding songs

Each entry in the `SONGS` array:
```js
{ id:'YOUTUBE_ID', title:'...', artist:'...', genre:'Indie Rock', mood:'energetic', tags:['rock','guitar'] }
```
YouTube ID = the 11 chars after `?v=` in any YouTube URL.

---

## Mubert daily moods (edit in MUBERT_MOODS array)

One entry per weekday (0=Sun, 1=Mon ... 6=Sat):
```js
{ tags:'indie acoustic guitar chill', title:'Sunday Drift', desc:'Brief description' }
```
Tags drive the AI generation — be specific for better results.

---

## Station is live. Share the URL.
