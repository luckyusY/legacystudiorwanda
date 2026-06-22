/**
 * Build the HTML lookbook from .pdfwork/manifest.json (16:9, charcoal + gold,
 * outlined display type) modeled on the Legacy Studio company-profile deck.
 * Writes .pdfwork/lookbook.html (images referenced relatively from img/).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = path.join(root, ".pdfwork");
const manifest = JSON.parse(readFileSync(path.join(work, "manifest.json"), "utf8"));

const STUDIO = {
  name: "Legacy Studio",
  tagline: "Capturing moments, creating timeless visual art.",
  about:
    "Legacy Studio is a creative photography and media production company based in Kigali, Rwanda. We blend creativity, storytelling and technical craft to turn meaningful moments into timeless visual art — imagery that resonates long after the shutter has closed.",
  services: [
    "Weddings & Pre-Wedding",
    "Portraiture",
    "Events & Celebrations",
    "Maternity & Newborn",
    "Commercial & Brand",
    "Product Photography",
    "Video & Highlights",
    "Artistic Sessions",
  ],
  location: "KG 3 AVE, Kacyiru — Kigali, Rwanda",
  phone: "(250) 788 202 813",
  email: "info@mylegacystudio.com",
  web: "mylegacystudio.com",
};

const QUOTES = [
  "Every frame, a memory worth keeping.",
  "Light, emotion, and the in-between.",
  "Stories told in stillness.",
];

const img = (file) => `img/${file}`;

/* ---------- page templates ---------- */
const pages = [];
const P = (html, cls = "") => pages.push(`<section class="page ${cls}">${html}</section>`);

function caption(label, sub = "") {
  return `<div class="cap"><span class="cap-line"></span><div><div class="cap-label">${label}</div>${
    sub ? `<div class="cap-sub">${sub}</div>` : ""
  }</div></div>`;
}

// COVER
function cover(hero) {
  P(
    `
    <div class="split">
      <div class="panel cover-panel">
        <div class="cover-top">
          <div class="kicker">Photography · Media · Kigali</div>
        </div>
        <div class="cover-title">
          <div class="ol ol-white">Legacy</div>
          <div class="ol ol-gold">Studio</div>
          <div class="gold-rule"></div>
          <div class="tag">Portfolio — 2026</div>
        </div>
        <div class="cover-foot">${STUDIO.web}</div>
      </div>
      <div class="img-col">
        <img src="${img(hero.file)}" />
        <div class="img-vignette"></div>
      </div>
    </div>`,
    "dark"
  );
}

// INTRO (portrait + dark text)
function intro(portrait) {
  P(
    `
    <div class="split">
      <div class="img-col w45"><img src="${img(portrait.file)}" /><div class="img-vignette"></div></div>
      <div class="panel intro-panel">
        <div class="num">01</div>
        <h2 class="ol ol-gold big">Who<br/>we are</h2>
        <p class="lead">${STUDIO.about}</p>
        <div class="rule-sm"></div>
        <p class="tagline">“${STUDIO.tagline}”</p>
      </div>
    </div>`,
    "dark"
  );
}

// DIVIDER (collection title + portrait)
function divider(n, title, subtitle, count, hero, flip = false) {
  const panel = `
    <div class="panel divider-panel">
      <div class="num">${String(n).padStart(2, "0")}</div>
      <div class="chapter-kicker">Collection</div>
      <h2 class="ol ol-gold huge">${title}</h2>
      <div class="divider-sub">${subtitle}</div>
      <div class="gold-rule"></div>
      <div class="divider-count">${count} selected frames</div>
    </div>`;
  const image = `<div class="img-col w55"><img src="${img(hero.file)}" /><div class="img-vignette"></div></div>`;
  P(`<div class="split">${flip ? image + panel : panel + image}</div>`, "dark");
}

// two portraits side by side
function twoUp(a, b, label) {
  P(
    `<div class="grid2">
       <div class="cell"><img src="${img(a.file)}" /></div>
       <div class="cell"><img src="${img(b.file)}" /></div>
     </div>${label ? caption(label) : ""}`,
    "dark bleed"
  );
}

// three portraits
function threeUp(a, b, c, label) {
  P(
    `<div class="grid3">
       <div class="cell"><img src="${img(a.file)}" /></div>
       <div class="cell"><img src="${img(b.file)}" /></div>
       <div class="cell"><img src="${img(c.file)}" /></div>
     </div>${label ? caption(label) : ""}`,
    "dark bleed"
  );
}

// single full-bleed (landscape)
function full(a, label) {
  P(`<div class="full"><img src="${img(a.file)}" /><div class="full-grad"></div>${label ? caption(label) : ""}</div>`, "dark bleed");
}

// portrait + quote panel
function splitQuote(a, quote, flip = false) {
  const image = `<div class="img-col w55"><img src="${img(a.file)}" /><div class="img-vignette"></div></div>`;
  const panel = `<div class="panel quote-panel"><div class="qmark">”</div><p class="quote">${quote}</p><div class="gold-rule"></div></div>`;
  P(`<div class="split">${flip ? panel + image : image + panel}</div>`, "dark");
}

// one big portrait + two stacked
function bigStack(a, b, c, label) {
  P(
    `<div class="bigstack">
       <div class="bs-main"><img src="${img(a.file)}" /></div>
       <div class="bs-side">
         <div class="cell"><img src="${img(b.file)}" /></div>
         <div class="cell"><img src="${img(c.file)}" /></div>
       </div>
     </div>${label ? caption(label) : ""}`,
    "dark bleed"
  );
}

// two landscapes stacked
function stackLand(a, b, label) {
  P(
    `<div class="stack2">
       <div class="cell"><img src="${img(a.file)}" /></div>
       <div class="cell"><img src="${img(b.file)}" /></div>
     </div>${label ? caption(label) : ""}`,
    "dark bleed"
  );
}

/* ---------- assemble ---------- */
const all = manifest;
const heroImg = all[0].items[0];

cover(heroImg);
intro(all[0].items[1] || all[0].items[0]);
splitQuote(all[0].items[2] || all[0].items[0], QUOTES[0], false);

let chapter = 0;
for (const col of all) {
  chapter++;
  const ports = col.items.filter((i) => i.orient !== "land");
  const lands = col.items.filter((i) => i.orient === "land");

  const heroP = ports.shift() || col.items[0];
  divider(chapter, col.title, col.subtitle, col.items.length, heroP, chapter % 2 === 0);

  let step = 0;
  let usedQuote = false;
  while (ports.length || lands.length) {
    const cap = `${col.title} · ${col.category}`;
    // sprinkle a landscape full-bleed when available
    if (lands.length >= 2 && step % 4 === 3) {
      stackLand(lands.shift(), lands.shift(), cap);
    } else if (lands.length === 1 && step % 4 === 3) {
      full(lands.shift(), cap);
    } else if (ports.length >= 3 && step % 3 === 1) {
      threeUp(ports.shift(), ports.shift(), ports.shift(), cap);
    } else if (ports.length >= 3 && step % 5 === 4) {
      bigStack(ports.shift(), ports.shift(), ports.shift(), cap);
    } else if (!usedQuote && ports.length >= 1 && step % 6 === 2) {
      splitQuote(ports.shift(), QUOTES[chapter % QUOTES.length], step % 2 === 0);
      usedQuote = true;
    } else if (ports.length >= 2) {
      twoUp(ports.shift(), ports.shift(), cap);
    } else if (ports.length === 1 && lands.length === 1) {
      twoUp(ports.shift(), lands.shift(), cap);
    } else if (ports.length === 1) {
      // single leftover portrait -> split with quote
      splitQuote(ports.shift(), QUOTES[(chapter + 1) % QUOTES.length], true);
    } else if (lands.length === 1) {
      full(lands.shift(), cap);
    }
    step++;
  }
}

// SERVICES
P(
  `
  <div class="services">
    <div class="num">—</div>
    <h2 class="ol ol-white big">What we<br/>create</h2>
    <div class="svc-grid">
      ${STUDIO.services.map((s, i) => `<div class="svc"><span class="svc-n">${String(i + 1).padStart(2, "0")}</span>${s}</div>`).join("")}
    </div>
    <div class="gold-rule"></div>
  </div>`,
  "dark center-pad"
);

// CLOSING / CONTACT
function closing(a) {
  P(
    `
    <div class="split">
      <div class="img-col w50"><img src="${img(a.file)}" /><div class="img-vignette"></div></div>
      <div class="panel contact-panel">
        <div class="kicker">Let's create together</div>
        <h2 class="ol ol-gold big">Your story<br/>is next.</h2>
        <div class="contact">
          <div class="c-row"><span>Studio</span>${STUDIO.location}</div>
          <div class="c-row"><span>Phone</span>${STUDIO.phone}</div>
          <div class="c-row"><span>Email</span>${STUDIO.email}</div>
          <div class="c-row"><span>Web</span>${STUDIO.web}</div>
        </div>
        <div class="gold-rule"></div>
        <div class="signoff ol ol-white">Legacy Studio</div>
      </div>
    </div>`,
    "dark"
  );
}
closing(all[all.length - 1].items[2] || all[0].items[3] || heroImg);

/* ---------- shell ---------- */
const css = `
:root{
  --bg:#0d0d0f; --panel:#141418; --panel2:#1a1a20;
  --gold:#e7bc3f; --gold-soft:#f0d384; --cream:#f4f1ea;
  --ink:#edeae3; --muted:#9b968c; --line:#2a2a30;
}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{background:#000;}
@page{ size:1920px 1080px; margin:0; }
.page{ position:relative; width:1920px; height:1080px; overflow:hidden;
  background:var(--bg); color:var(--ink); break-after:page;
  font-family:Arial,Helvetica,sans-serif; }
.page:last-child{ break-after:auto; }
.page.dark{ background:var(--bg); }

img{ width:100%; height:100%; object-fit:cover; object-position:center; display:block; }

/* display / outlined type */
.ol{ font-family:"Arial Black",Impact,"Haettenschweiler",sans-serif; font-weight:900; line-height:.86;
  letter-spacing:-.01em; text-transform:none; }
.ol-gold{ color:transparent; -webkit-text-stroke:2px var(--gold); }
.ol-white{ color:transparent; -webkit-text-stroke:2px #fff; }
.ol.huge{ font-size:170px; }
.ol.big{ font-size:128px; }

/* layout */
.split{ display:flex; width:100%; height:100%; }
.img-col{ position:relative; flex:1 1 0; height:100%; overflow:hidden; }
.img-col.w45{ flex:0 0 45%; } .img-col.w50{ flex:0 0 50%; }
.img-col.w55{ flex:0 0 55%; }
.img-vignette{ position:absolute; inset:0;
  background:linear-gradient(90deg, rgba(13,13,15,.55), transparent 22%, transparent 78%, rgba(13,13,15,.35)); }
.panel{ position:relative; flex:1 1 0; height:100%; background:var(--panel);
  padding:96px 92px; display:flex; flex-direction:column; }

.kicker{ font-size:20px; letter-spacing:.42em; text-transform:uppercase; color:var(--gold); }
.num{ font-family:"Arial Black",Impact,sans-serif; font-size:30px; color:var(--gold); opacity:.7; }
.gold-rule{ width:120px; height:4px; background:var(--gold); margin:34px 0; }
.rule-sm{ width:80px; height:3px; background:var(--gold); margin:28px 0; }

/* cover */
.cover-panel{ background:
  radial-gradient(120% 80% at 20% 0%, #1b1b20, #0c0c0e);
  justify-content:space-between; }
.cover-panel::after{ content:""; position:absolute; inset:0; opacity:.05;
  background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);
  background-size:54px 54px; pointer-events:none; }
.cover-title{ position:relative; z-index:1; }
.cover-title .ol{ font-size:150px; }
.tag{ display:inline-block; margin-top:30px; background:var(--gold); color:#1a1408;
  font-weight:700; font-size:24px; letter-spacing:.08em; padding:12px 26px; }
.cover-foot{ position:relative; z-index:1; color:var(--muted); letter-spacing:.3em;
  text-transform:uppercase; font-size:18px; }

/* intro */
.intro-panel{ justify-content:center; background:var(--panel); }
.intro-panel .lead{ font-size:30px; line-height:1.55; color:#d9d5cc; max-width:640px; margin-top:34px; font-weight:300; }
.tagline{ font-style:italic; color:var(--gold-soft); font-size:26px; }
.intro-panel .big{ margin-top:14px; }

/* divider */
.divider-panel{ justify-content:center; background:
  radial-gradient(120% 90% at 30% 20%, #1c1c22, #0c0c0e); }
.chapter-kicker{ font-size:20px; letter-spacing:.4em; text-transform:uppercase; color:var(--muted); margin-top:10px; }
.divider-sub{ font-size:34px; color:var(--ink); margin-top:18px; font-weight:300; }
.divider-count{ font-size:18px; letter-spacing:.3em; text-transform:uppercase; color:var(--gold); }
.huge{ margin-top:8px; }

/* grids */
.page.bleed{ padding:0; background:#000; }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:6px; width:100%; height:100%; }
.grid3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; width:100%; height:100%; }
.stack2{ display:grid; grid-template-rows:1fr 1fr; gap:6px; width:100%; height:100%; }
.cell{ position:relative; overflow:hidden; }
.full{ position:relative; width:100%; height:100%; }
.full-grad{ position:absolute; inset:0; background:linear-gradient(0deg, rgba(0,0,0,.45), transparent 35%); }
.bigstack{ display:grid; grid-template-columns:2fr 1fr; gap:6px; width:100%; height:100%; }
.bs-side{ display:grid; grid-template-rows:1fr 1fr; gap:6px; }

/* caption */
.cap{ position:absolute; left:44px; bottom:40px; display:flex; align-items:center; gap:18px; z-index:3; }
.cap-line{ width:54px; height:2px; background:var(--gold); display:block; }
.cap-label{ font-size:20px; letter-spacing:.3em; text-transform:uppercase; color:#fff;
  text-shadow:0 2px 14px rgba(0,0,0,.8); }
.cap-sub{ font-size:15px; color:var(--gold-soft); letter-spacing:.15em; }

/* quote */
.quote-panel{ justify-content:center; align-items:flex-start; background:
  radial-gradient(120% 90% at 70% 20%, #1b1b21, #0c0c0e); }
.qmark{ font-family:"Arial Black",Impact,serif; font-size:160px; color:var(--gold); opacity:.25; line-height:.5; }
.quote{ font-size:52px; line-height:1.18; color:var(--ink); font-weight:300; max-width:620px; margin-top:10px; }

/* services */
.services{ padding:110px 120px; height:100%; display:flex; flex-direction:column; justify-content:center;
  background:radial-gradient(120% 90% at 80% 10%, #1a1a20, #0c0c0e); }
.svc-grid{ display:grid; grid-template-columns:1fr 1fr; gap:22px 70px; margin-top:46px; max-width:1300px; }
.svc{ display:flex; align-items:baseline; gap:22px; font-size:34px; color:#e4e0d8; font-weight:300;
  border-bottom:1px solid var(--line); padding-bottom:18px; }
.svc-n{ font-family:"Arial Black",Impact,sans-serif; font-size:20px; color:var(--gold); }

/* contact */
.contact-panel{ justify-content:center; background:
  radial-gradient(120% 90% at 30% 20%, #1c1c22, #0c0c0e); }
.contact{ margin-top:30px; }
.c-row{ display:flex; gap:26px; font-size:26px; color:#ddd9d0; padding:14px 0; border-bottom:1px solid var(--line); }
.c-row span{ width:120px; color:var(--gold); text-transform:uppercase; font-size:16px; letter-spacing:.2em; align-self:center; }
.signoff{ font-size:56px; margin-top:auto; }
.contact-panel .big{ margin-top:12px; }
`;

// No web fonts: use robust system fonts (Arial Black ≈ the reference's heavy grotesque).
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${pages.join("\n")}</body></html>`;
writeFileSync(path.join(work, "lookbook.html"), html);
console.log(`lookbook.html written — ${pages.length} pages`);
