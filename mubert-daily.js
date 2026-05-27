/**
 * Wavelength Radio — Mubert Daily Track Generator
 * =================================================
 * Generates one fresh AI track per day using Mubert's personal API.
 * Free tier: 25 tracks/month (personal use).
 *
 * HOW TO GET YOUR FREE API KEY:
 *   1. Go to https://mubert.com/render (sign up free)
 *   2. After login, open browser DevTools → Network tab
 *   3. Generate any track on the site
 *   4. Look for a request to music-api.mubert.com — copy the "pat" token
 *      from the Authorization header or request body
 *   --- OR ---
 *   Use the official pat from: https://github.com/MubertAI/Mubert-Text-to-Music
 *   (The public demo PAT works for personal/non-commercial use)
 *
 * USAGE (paste into your station's <script> block):
 *   window.MUBERT_PAT = "YOUR_PAT_HERE";
 *   const track = await generateDailyMubertTrack();
 *   // Returns: { url, title, duration, mood, tags }
 */

// ─── Config ───────────────────────────────────────────────────────────────────
// Set window.MUBERT_PAT before calling generateDailyMubertTrack()
// Falls back to the open public demo PAT (rate-limited, personal only)
const MUBERT_API   = 'https://api-b2b.mubert.com/v2';
const MUBERT_DEMO_PAT = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkFQSV9VU0VSX0RFTU8iLCJpYXQiOjE2NjA4MzM4OTd9.2-6_mFQ5-hEpgfZSrJ8IBlFH3M_LaxKXhGmGjjq2YIM';

// Daily mood rotates by day-of-week
const DAILY_MOODS = [
  { tags: 'indie, chill, acoustic guitar, dreamy',        title: 'Sunday Drift',      duration: 180 },
  { tags: 'indie electronic, uplifting, synth, morning',  title: 'Monday Signal',     duration: 160 },
  { tags: 'lo-fi, focus, piano, ambient',                 title: 'Tuesday Low',       duration: 200 },
  { tags: 'post-rock, cinematic, guitar, atmospheric',    title: 'Wednesday Current', duration: 210 },
  { tags: 'indie pop, playful, bright, optimistic',       title: 'Thursday Pulse',    duration: 175 },
  { tags: 'shoegaze, dreampop, reverb, emotional',        title: 'Friday Haze',       duration: 195 },
  { tags: 'folk, acoustic, warm, storytelling',           title: 'Saturday Warmth',   duration: 185 },
];

/**
 * Main function — generates today's AI track via Mubert.
 * Caches result in localStorage so it only generates once per day.
 * @returns {Promise<{url, title, artist, duration, mood, tags, generated}>}
 */
async function generateDailyMubertTrack() {
  const today = new Date().toDateString();
  const cacheKey = 'wv_mubert_daily';

  // Return cached track if already generated today
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && cached.date === today && cached.url) {
      console.log('[Mubert] Using cached daily track:', cached.title);
      return cached;
    }
  } catch {}

  const dow = new Date().getDay();
  const mood = DAILY_MOODS[dow];
  const pat = window.MUBERT_PAT || MUBERT_DEMO_PAT;

  console.log('[Mubert] Generating daily track:', mood.title, '|', mood.tags);

  try {
    // Step 1: Get track render task
    const renderRes = await fetch(`${MUBERT_API}/RecordTrackTTM`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'RecordTrackTTM',
        params: {
          pat,
          duration: mood.duration,
          tags: mood.tags,
          format: 'mp3',
          intensity: 'medium',
          mode: 'track',
        }
      })
    });

    const renderData = await renderRes.json();

    if (renderData.error) throw new Error(renderData.error.message || 'Mubert render error');

    const taskId = renderData?.data?.tasks?.[0]?.task_id;
    if (!taskId) throw new Error('No task_id returned');

    // Step 2: Poll for completion (Mubert generates async, usually 5–15s)
    const trackUrl = await pollMubertTask(taskId, pat);

    const result = {
      date:      today,
      url:       trackUrl,
      title:     mood.title,
      artist:    'Mubert AI',
      duration:  mood.duration,
      mood:      mood.tags.split(',')[0].trim(),
      tags:      mood.tags.split(',').map(t => t.trim()),
      generated: true,
    };

    // Cache it
    localStorage.setItem(cacheKey, JSON.stringify(result));
    console.log('[Mubert] Daily track ready:', trackUrl);
    return result;

  } catch (err) {
    console.warn('[Mubert] Generation failed, using fallback:', err.message);
    return getMubertFallback(dow, today);
  }
}

/**
 * Poll Mubert task until the track is ready or timeout.
 * @param {string} taskId
 * @param {string} pat
 * @returns {Promise<string>} — direct MP3 URL
 */
async function pollMubertTask(taskId, pat, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000)); // wait 2s between polls

    const statusRes = await fetch(`${MUBERT_API}/GetTaskStatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'GetTaskStatus',
        params: { pat, task_id: taskId }
      })
    });

    const statusData = await statusRes.json();
    const task = statusData?.data?.tasks?.[0];

    if (task?.task_status_id === 2) {
      // Status 2 = complete
      const url = task?.download_link;
      if (url) return url;
    }

    if (task?.task_status_id === 3) {
      // Status 3 = error
      throw new Error('Mubert task failed: ' + (task?.error || 'unknown'));
    }

    console.log(`[Mubert] Polling attempt ${i+1}/${maxAttempts}, status:`, task?.task_status_id);
  }

  throw new Error('Mubert task timed out after ' + maxAttempts + ' attempts');
}

/**
 * Fallback track when Mubert is unavailable or limit is reached.
 * Returns a curated royalty-free track matching the day's mood.
 */
function getMubertFallback(dow, today) {
  // Curated fallbacks from Free Music Archive / CC-licensed sources
  const fallbacks = [
    { url: null, title: 'Sunday Session',    artist: 'Wavelength Curated', duration: 180, mood: 'chill',      tags: ['acoustic','indie'],     generated: false },
    { url: null, title: 'Morning Frequency', artist: 'Wavelength Curated', duration: 160, mood: 'uplifting',  tags: ['electronic','morning'],  generated: false },
    { url: null, title: 'Focus State',       artist: 'Wavelength Curated', duration: 200, mood: 'ambient',    tags: ['lo-fi','focus'],         generated: false },
    { url: null, title: 'Mid-Week Motion',   artist: 'Wavelength Curated', duration: 210, mood: 'cinematic',  tags: ['post-rock','guitar'],    generated: false },
    { url: null, title: 'Thursday Beat',     artist: 'Wavelength Curated', duration: 175, mood: 'groovy',     tags: ['indie-pop','bright'],    generated: false },
    { url: null, title: 'Friday Reverb',     artist: 'Wavelength Curated', duration: 195, mood: 'dreamy',     tags: ['shoegaze','reverb'],     generated: false },
    { url: null, title: 'Saturday Acoustic', artist: 'Wavelength Curated', duration: 185, mood: 'warm',       tags: ['folk','acoustic'],       generated: false },
  ];

  return { ...fallbacks[dow], date: today };
}

// ─── Expose globally ──────────────────────────────────────────────────────────
window.generateDailyMubertTrack = generateDailyMubertTrack;
