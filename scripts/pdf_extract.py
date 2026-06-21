"""
Extract real photos from the Legacy Studio profile PDF.
- Dedupes by xref, keeps images with min side >= 500px and >20KB
- Downscales to max 2000px long edge, re-encodes JPEG q85
- Infers a gallery category from the text of the page the image appears on
- Writes processed images + manifest.json to OUT_DIR
"""
import fitz  # PyMuPDF
from PIL import Image
import io, json, os

PDF = r"C:\Users\HP\Downloads\legacy Revised.pdf"
OUT_DIR = r"C:\Users\HP\Documents\legacystudio\.extracted"
MAX_SIDE = 2000
MIN_SIDE = 500
MIN_BYTES = 20000
JPEG_Q = 85

os.makedirs(OUT_DIR, exist_ok=True)

KEYWORDS = [
    ("Wedding", ["wedding", "bride", "groom", "marriage", "civil", "traditional"]),
    ("Maternity", ["maternity", "pregnan", "expecting"]),
    ("Kids", ["kid", "child", "baby", "birthday"]),
    ("Product", ["product", "commercial", "branding"]),
    ("Event", ["event", "party", "graduation", "funeral", "baptism", "proposal", "shower"]),
    ("Artistic", ["art", "creative", "themed", "styled"]),
    ("Portrait", ["portrait", "headshot"]),
]


def infer_category(text: str) -> str:
    t = (text or "").lower()
    for cat, words in KEYWORDS:
        if any(w in t for w in words):
            return cat
    return "Portrait"


doc = fitz.open(PDF)

# Map each xref to the first page it appears on (for category context)
xref_page = {}
page_text = {}
for pno in range(doc.page_count):
    page = doc[pno]
    page_text[pno] = page.get_text()
    for img in page.get_images(full=True):
        xref = img[0]
        if xref not in xref_page:
            xref_page[xref] = pno

manifest = []
idx = 0
for xref, pno in xref_page.items():
    try:
        info = doc.extract_image(xref)
    except Exception:
        continue
    w, h = info.get("width", 0), info.get("height", 0)
    raw = info.get("image", b"")
    if min(w, h) < MIN_SIDE or len(raw) < MIN_BYTES:
        continue

    try:
        im = Image.open(io.BytesIO(raw))
        im = im.convert("RGB")
    except Exception:
        continue

    # Downscale
    scale = min(1.0, MAX_SIDE / max(im.width, im.height))
    if scale < 1.0:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)

    idx += 1
    fname = f"photo_{idx:03d}.jpg"
    fpath = os.path.join(OUT_DIR, fname)
    im.save(fpath, "JPEG", quality=JPEG_Q, optimize=True)

    manifest.append({
        "file": fname,
        "category": infer_category(page_text.get(pno, "")),
        "width": im.width,
        "height": im.height,
        "page": pno + 1,
    })

# Mark the 8 largest landscape-ish images as featured for the home page
by_area = sorted(manifest, key=lambda m: m["width"] * m["height"], reverse=True)
for m in by_area[:8]:
    m["featured"] = True
for m in manifest:
    m.setdefault("featured", False)

with open(os.path.join(OUT_DIR, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

# Category summary
from collections import Counter
cats = Counter(m["category"] for m in manifest)
print(f"Extracted {len(manifest)} photos to {OUT_DIR}")
print("Categories:", dict(cats))
print("Featured:", sum(1 for m in manifest if m["featured"]))
total_mb = sum(os.path.getsize(os.path.join(OUT_DIR, m["file"])) for m in manifest) / (1024 * 1024)
print(f"Total processed size: {total_mb:.1f} MB")
