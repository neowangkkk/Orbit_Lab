# Deploying to Cloudflare Pages, replacing the Wix site

**Current state (verified 2026-09-06)**

| | |
|---|---|
| Domain registrar | GoDaddy Canada — expires 2027-01-06 |
| DNS hosted by | GoDaddy (`ns59` / `ns60.domaincontrol.com`) |
| `orbitlab.ca` | A → `185.230.63.107` (Wix) |
| `www.orbitlab.ca` | CNAME → `pointing.wixdns.net` (Wix) |
| MX / SPF / DMARC | **none** — `info@orbitlab.ca` bounces; see [Email Routing](#fixing-it-with-cloudflare-email-routing-free) |

The domain is registered at GoDaddy, *not* through Wix. Wix is only being
pointed at. So cancelling Wix cannot cost you the domain, and no domain
transfer is needed.

---

## Step 1 — Put the site on Cloudflare Pages

**Option A — drag and drop (no GitHub needed)**

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**
2. Project name: `orbitlab`
3. Drag the **`site/`** folder in (the folder itself, so `index.html` sits at the root of the upload)
4. **Deploy** → you get `https://orbitlab.pages.dev`

**Option B — deploy automatically on every `git push`**

1. Push this repo to GitHub (it is already committed locally)
2. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the repo
3. Build settings:
   - Framework preset: **None**
   - Build command: **leave empty**
   - Build output directory: **`site`**
4. **Save and Deploy**

Nothing needs compiling — it is plain HTML.

## Step 2 — Test on the temporary URL *before* touching DNS

On `https://orbitlab.pages.dev`, check:

- [ ] all five pages load: `/`, `/our-vision`, `/people`, `/birth-of-ideas`, `/privacy-policy`
- [ ] the hero video plays on the homepage
- [ ] all five story PDFs open from Birth of Ideas
- [ ] the nine headshots appear on People
- [ ] the mobile menu opens (narrow the window)

Fix anything wrong here, while the live site is still safely on Wix.

## Step 3 — Move DNS hosting to Cloudflare

The apex domain `orbitlab.ca` **cannot** be pointed at Pages with a CNAME while
DNS lives at GoDaddy — plain DNS forbids a CNAME at the apex, and GoDaddy has no
CNAME flattening. Cloudflare does, so DNS hosting has to move. **The domain
stays registered at GoDaddy**; only the nameservers change, and it is free.

1. Cloudflare → **Add a site** → `orbitlab.ca` → **Free** plan
2. Cloudflare scans the existing records. There is nothing here worth keeping —
   no mail, no verification TXT, just the two Wix web records, which Step 4
   replaces. If the scan shows anything you don't recognise, stop and check it.
3. Cloudflare shows **two nameservers**. Copy them.
4. At **GoDaddy** → *My Products* → `orbitlab.ca` → **DNS** → **Nameservers** →
   **Change** → **I'll use my own nameservers** → paste Cloudflare's two → save.
5. Wait for Cloudflare to report the domain **Active** — usually under an hour,
   occasionally up to 24–48 h.

> During propagation the site keeps serving from Wix. Nothing breaks.

## Step 4 — Attach the domain to the Pages project

1. Pages project → **Custom domains** → **Set up a custom domain**
2. Add **`www.orbitlab.ca`**, then add **`orbitlab.ca`**
3. Cloudflare creates the records itself (CNAME flattening covers the apex)
4. In **DNS → Records**, delete any leftovers pointing at Wix:
   - `A  orbitlab.ca → 185.230.63.107`
   - `CNAME  www → pointing.wixdns.net`
5. The HTTPS certificate issues automatically — a few minutes.

## Step 5 — Send the apex to `www`

Every page's `<link rel="canonical">` says `https://www.orbitlab.ca/…`, so make
`www` the real address and redirect the bare domain to it:

Cloudflare → **Rules** → **Redirect Rules** → **Create**

- If: hostname **equals** `orbitlab.ca`
- Then: **Dynamic** → `concat("https://www.orbitlab.ca", http.request.uri.path)`
- Status: **301**

## Step 6 — Verify on the real domain, then cancel Wix

Re-run the Step 2 checklist against `https://www.orbitlab.ca`, plus:

- [ ] `http://orbitlab.ca` redirects to `https://www.orbitlab.ca`
- [ ] the padlock shows a valid certificate
- [ ] `https://www.orbitlab.ca/sitemap.xml` and `/robots.txt` load
- [ ] a made-up URL like `/nope` shows the styled 404 page

**Only then** cancel the Wix Studio subscription. Leave it running about a week
as a fallback — it costs one extra billing cycle and means a two-minute
nameserver revert if something surfaces. Cancelling Wix does not touch the
domain: it is GoDaddy's.

Finally, in [Google Search Console](https://search.google.com/search-console),
add the property and submit `https://www.orbitlab.ca/sitemap.xml` so the new
site is re-indexed at the same URLs.

---

## Updating the site later

**Option A:** re-drag the `site/` folder into the Pages project (new deployment).

**Option B (if you connected Git):**

```bash
git add -A && git commit -m "Update people page" && git push
```

Cloudflare rebuilds automatically. Every deployment is kept, and you can
roll back to any previous one from the dashboard in one click.

---

## Two things to sort out separately

**1. `info@orbitlab.ca` does not receive mail.** The domain has no MX records
at all — no mail server, no SPF, no DMARC. Anything sent to that address
bounces, yet it is printed in the footer of every page and the privacy policy
directs people there for data-deletion requests. This was already true on the
Wix site.

### Fixing it with Cloudflare Email Routing (free)

> **Prerequisite: Step 3 must be done first.** Email Routing writes MX records
> into the zone, so it only becomes available once `orbitlab.ca` is Active on
> Cloudflare. It cannot be set up while DNS is still at GoDaddy.

1. Cloudflare dashboard → select **orbitlab.ca** → **Email** → **Email Routing**
   → **Get started**
2. **Destination address**: the real inbox that should receive the mail. Cloudflare
   emails it a verification link — **click it**, or routing silently never starts.
3. **Custom address**: `info@orbitlab.ca` → **Send to** → your verified destination.
4. Cloudflare offers to add the required DNS records — accept. It adds three MX
   records (`route1/2/3.mx.cloudflare.net`) plus an SPF `TXT`.
5. Toggle **Email Routing** on.

Verify by sending a message to `info@orbitlab.ca` from an unrelated account; it
should land in the destination inbox within a minute, showing the original sender.

**Consider a catch-all** (Email Routing → Catch-all address) so mail to
`hello@`, `contact@`, or a mistyped address is not lost.

### The limitation to know about

Email Routing **forwards only — it cannot send**. There is no SMTP server, so
nobody can reply *from* `info@orbitlab.ca`; replies go out from whichever
personal inbox received the forward, and the sender sees that address.

For a privacy-policy contact handling data-deletion requests, that is a bit
awkward. Three ways out:

- **Live with it** — fine for a small lab; just be aware the reply reveals a
  personal address.
- **A real mailbox** — if the iSchool will provision one for the lab, use that
  instead and skip Email Routing entirely.
- **A paid sender** (Fastmail, Migadu, Google Workspace, ~$3–6/month) if sending
  from the address genuinely matters.

### While you are in DNS: block spoofing

Nothing sends mail *from* `orbitlab.ca`, and a domain with no policy is easy to
forge. Once Email Routing has added its SPF record, add a DMARC record too —
DNS → Records → **TXT**, name `_dmarc`, content:

```
v=DMARC1; p=reject
```

`p=reject` tells receiving servers to drop anything forged as `@orbitlab.ca`.
(You can append `; rua=mailto:info@orbitlab.ca` to receive aggregate reports,
but they arrive as daily XML attachments and would clutter the forwarded inbox
— skip it unless you intend to read them.)
Safe here precisely because the domain has no legitimate outbound mail. If you
later add a real mailbox or a newsletter tool, revisit this first — it will
block them too.

**Other options instead of the above:** a UofT / iSchool mailbox, or simply
replacing the address on the site with one that already works.

**2. Cloudflare Pages limits** (well within range today): 25 MiB per file — the
largest is `facial-recognition.pdf` at 19 MB, so a bigger PDF later could hit the
cap; 20,000 files — currently 63. Bandwidth is unmetered.
