# First 5K — free installable running coach

A self-contained Progressive Web App (PWA) for a beginner 9-week run/walk program.

## Included
- Nine-week plan, three sessions per week
- Timed run/walk stages with spoken prompts, tone and vibration settings
- Optional GPS distance and average pace
- Local workout history, progress dashboard and JSON backup export
- Offline app-shell caching after first successful load
- Screen Wake Lock request where supported
- No analytics, account, paid API, subscription, or server-side database

## Install on Android (free)
A PWA must be served from HTTPS (or localhost) to install reliably. Opening `index.html` directly from Downloads is only a local preview and does not provide full install/offline capabilities.

### Free hosting with GitHub Pages
1. Sign in to GitHub or create a free account.
2. Create a new public repository, e.g. `first5k`.
3. Upload all files in this folder to the repository root.
4. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the Pages URL to appear. Open that HTTPS URL in Chrome on your Samsung phone.
6. In Chrome's menu choose **Install app** or **Add to Home screen**. Wording can vary.
7. Open the installed app once, allow notifications/location only if desired, then test sound and GPS outdoors before a real run.

This uses free GitHub Pages static hosting and does not require an API key. GitHub account and public repository visibility are required for this route; do not put private information in the repository.

## Important limitations
- A PWA is not a native Android APK and is not published in Google Play.
- Browsers may throttle timers, speech, GPS, or audio when the page is backgrounded or the phone locks. The app requests Screen Wake Lock when enabled, which helps keep the screen awake but does not guarantee native background operation. For dependable screen-locked coaching, a native Android app with a foreground service is the stronger solution.
- GPS accuracy depends on phone reception, weather, route and device. The app filters some noisy readings but is not a medical or race-grade device.
- Progress is stored in local browser storage. Use Export backup to keep a copy. Clearing browser storage can erase records.
- The nine-week schedule is an original beginner progression inspired by common Couch-to-5K structure. First 5K is independent and is not affiliated with ACTIVE Network, LLC.
