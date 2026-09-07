# Image credits

## Unsplash (Unsplash License)

Four placeholder photos on the site are free-licensed stock from Unsplash. The
[Unsplash License](https://unsplash.com/license) permits free use, commercial
and non-commercial, without permission, and allows self-hosting. Attribution is
**not required** — it's recorded here as good practice and so these are easy to
find and swap out later for the lab's own photography.

| File | Unsplash photo | Used on |
|---|---|---|
| `home/people-collage` | [`fm4B1xWEIsU`](https://unsplash.com/photos/fm4B1xWEIsU) — diverse team collaborating around a table | Home → "Our People" |
| `vision/colleagues` | [`gMsnXqILjp4`](https://unsplash.com/photos/gMsnXqILjp4) — workshop presentation | Our Vision → top banner |
| `vision/robotic-hand` | [`jIBMSMs4_kA`](https://unsplash.com/photos/jIBMSMs4_kA) — close-up of a white robot hand | Our Vision → "We Engage" |
| `vision/drone` | [`ZlkRrzJl20Q`](https://unsplash.com/photos/ZlkRrzJl20Q) — quadcopter over snow mountains | Our Vision → "Innovation Is Not Mysterious" |

These replaced four Wix stock images carried over from the original site, whose
licence generally covers use *on Wix-hosted sites only* and so did not travel
with the migration.

### Swapping one out

Drop a replacement in as both `.webp` and `.jpg` at the same path and aspect
ratio — nothing in the HTML needs to change:

| Slot | Size | Aspect |
|---|---|---|
| `home/people-collage` | 1920×1200 | 16:10 |
| `vision/colleagues` | 1920×1200 | 16:10 |
| `vision/robotic-hand` | 1600×2000 | 4:5 |
| `vision/drone` | 1600×2000 | 4:5 |

Remember to update the `alt` text in `index.html` / `our-vision.html` to
describe the new picture.

## The lab's own material

Everything else — all nine headshots in `people/`, the five story images in
`stories/`, `home/featured-qr-code`, `home/vision-preview`, `home/hero-poster`,
and `video/hero.mp4` — came from the original orbitlab.ca and belongs to
ORBIT LAB.
