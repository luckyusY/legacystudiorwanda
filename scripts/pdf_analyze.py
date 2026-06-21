import fitz  # PyMuPDF
import sys
from collections import Counter

PDF = r"C:\Users\HP\Downloads\legacy Revised.pdf"

doc = fitz.open(PDF)
print(f"Pages: {doc.page_count}")

seen = {}  # xref -> (w, h, ext, size)
for pno in range(doc.page_count):
    for img in doc.get_page_images(pno, full=True):
        xref = img[0]
        if xref in seen:
            continue
        try:
            info = doc.extract_image(xref)
        except Exception:
            continue
        seen[xref] = (info.get("width", 0), info.get("height", 0),
                      info.get("ext", "?"), len(info.get("image", b"")))

print(f"Unique embedded images (by xref): {len(seen)}")

# Size buckets by min dimension
def bucket(minside):
    if minside < 200: return "<200"
    if minside < 400: return "200-399"
    if minside < 600: return "400-599"
    if minside < 1000: return "600-999"
    return ">=1000"

b = Counter()
exts = Counter()
big = 0
for (w, h, ext, size) in seen.values():
    b[bucket(min(w, h))] += 1
    exts[ext] += 1
    if min(w, h) >= 500 and size > 30000:
        big += 1

print("\nBy min-dimension bucket:")
for k in ["<200", "200-399", "400-599", "600-999", ">=1000"]:
    print(f"  {k:>8}: {b[k]}")
print("\nBy extension:", dict(exts))
print(f"\nLikely real photos (min side >=500px and >30KB): {big}")

# Show a few largest
top = sorted(seen.items(), key=lambda kv: kv[1][3], reverse=True)[:5]
print("\nLargest 5 (xref, w, h, ext, KB):")
for xref, (w, h, ext, size) in top:
    print(f"  {xref}: {w}x{h} {ext} {size//1024}KB")
