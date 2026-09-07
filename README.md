# ORBIT LAB — orbitlab.ca

A hand-built static rebuild of the ORBIT LAB website, migrated off Wix Studio.
No build step, no framework, no platform lock-in: plain HTML, one CSS file, one JS file.

```
Orbit_Lab/
├── site/                     ← the deployable website
│   ├── index.html            ← Home
│   ├── our-vision.html
│   ├── people.html
│   ├── birth-of-ideas.html
│   ├── privacy-policy.html
│   └── assets/
│       ├── css/style.css
│       ├── js/main.js
│       ├── img/  (webp + jpg, 21 images)
│       ├── pdf/  (5 story PDFs, self-hosted)
│       └── video/hero.mp4
└── _original/                ← archive of the scraped Wix site (not deployed)
```

## Run it locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

`site/` is a plain static folder — drop it on GitHub Pages, Netlify, Cloudflare
Pages, or any university web host. Nothing needs to be compiled.

If you want the old Wix URLs (`/our-vision`, no `.html`) to keep working, either
enable "clean URLs" on your host, or rename each file into its own folder
(`our-vision/index.html`) and drop the `.html` from the links.

---

## What was carried over

All text, images, the hero video, and all five story PDFs came from the live
site and are now **self-hosted** — nothing loads from `wixstatic.com`,
`parastorage.com`, or any other Wix domain any more.

| Original (Wix) | Now |
|---|---|
| `static.wixstatic.com/media/…` (21 images) | `assets/img/…` |
| `video.wixstatic.com/video/…` | `assets/video/hero.mp4` |
| `orbitlab.ca/_files/ugd/fa56b4_*.pdf` (5 files) | `assets/pdf/*.pdf` |

Images were resized and re-encoded to WebP + JPEG: **46 MB → 6.3 MB**.

### Story PDFs — renamed from Wix hashes to real names

| Was | Now | On the page as |
|---|---|---|
| `fa56b4_948db339…pdf` | `facial-recognition.pdf` | Facial Recognition |
| `fa56b4_44171fb8…pdf` | `qr-code.pdf` | The QR Code |
| `fa56b4_1acae04c…pdf` | `sql-databases.pdf` | SQL & Databases |
| `fa56b4_4dfaa2f6…pdf` | `chatbots.pdf` | Chatbots |
| `fa56b4_04cd50a5…pdf` | `voice-user-interfaces.pdf` | Voice User Interfaces |

The original gallery had **no titles at all** — just five images linking to
PDFs. Titles and author credits were derived from the PDF filenames
(`Week_8_shancordelia_QR CODE.pdf` → "The QR Code", Cordelia Shan). Please check
them. `INF1003_VUI.pdf` had no name in the filename, so that card carries no
author credit rather than a guessed one.

---

## Please review before publishing

1. **Social links are gone.** The old footer's Facebook / Instagram / LinkedIn
   icons pointed at *Wix's own* corporate accounts (`facebook.com/WixStudio`,
   `instagram.com/wixstudio`, `linkedin.com/company/wix-com`) — template
   defaults nobody ever changed. Rather than carry over links to a vendor's
   social media, the footer now lists real site sections. Send me the lab's
   actual social URLs and I'll put the icons back.

2. **The four Wix stock photos have been replaced** with free-licensed Unsplash
   images (`home/people-collage`, `vision/colleagues`, `vision/robotic-hand`,
   `vision/drone`). The Unsplash License allows commercial use and self-hosting,
   so there's no longer a licensing question hanging over the site. Details and
   swap instructions are in [`site/assets/img/CREDITS.md`](site/assets/img/CREDITS.md).

   These are still placeholders, not the lab's own photography — worth
   replacing with real ORBIT LAB photos when you have them. Everything else
   (headshots, story images, hero video) was always the lab's own.

3. **`© 2035` → `© 2026`.** The old footer said 2035, a leftover from the Wix
   template's placeholder text.

4. **Privacy policy contact fixed.** The live page literally read "please
   contact us at **[your email here]**". It now says `info@orbitlab.ca`.

5. **"8 Members" vs. nine bios.** The homepage counter says 8, but the People
   page lists nine people. I kept the original 8 rather than silently changing
   your number — update whichever is wrong.

6. **Bios are verbatim**, including a few typos in the original ("I holds…",
   "I also brings…"). I only closed one run-together word ("consultingand" →
   "consulting and"). Tell me if you'd like the grammar tidied — I left other
   people's self-written bios alone on purpose.

7. **Facial Recognition PDF is 18 MB**, which is a slow download on mobile.
   Worth compressing.

---

## Notes on the build

- **Fonts, colours, and spacing** were lifted from the original theme: cream
  `#FFFEED`, ink `#171200`, tan `#D6CEAD`, olive `#847539`, Work Sans.
- **Content is visible without JavaScript.** The scroll-reveal animation only
  arms itself once JS is confirmed running (`html.js`), and has two independent
  fallbacks, so a script failure can never leave the page blank — a real risk
  with the naive version of this pattern.
- **Accessibility:** skip link, focus-visible outlines, `aria-current` on the
  active nav item, labelled mobile menu, alt text on every image, and full
  `prefers-reduced-motion` support.
- The hero video is muted/looping/`playsinline` and pauses when scrolled out of
  view to save battery and data.
