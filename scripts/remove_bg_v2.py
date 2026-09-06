#!/usr/bin/env python3
"""Flood-fill background removal v2 - tight tolerance + subject protection."""
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
from scipy import ndimage as ndi

src = "/home/z/my-project/public/images/profile.png"
dst = "/home/z/my-project/public/images/profile-cutout.png"

print("Loading...")
img = Image.open(src).convert("RGB")
img.thumbnail((900, 1120))
w, h = img.size
arr = np.array(img).astype(np.int32)

# --- Analyze background variance from all edge pixels ---
edge_pixels = np.concatenate([
    arr[0:3, :].reshape(-1, 3), arr[h-3:, :].reshape(-1, 3),
    arr[:, 0:3].reshape(-1, 3), arr[:, w-3:].reshape(-1, 3),
])
bg = np.median(edge_pixels, axis=0)
spread = np.abs(edge_pixels - bg).sum(axis=1)
print(f"BG median: {bg}, edge spread: p50={np.percentile(spread,50):.0f} p95={np.percentile(spread,95):.0f} max={spread.max():.0f}")

# Tight tolerance: just above background natural spread
tol_total = max(48.0, np.percentile(spread, 95) * 1.4)
print(f"Using tolerance: {tol_total:.0f}")

dist = np.abs(arr - bg).sum(axis=2)

# --- Flood fill from edges ---
mask = np.zeros((h, w), dtype=bool)
visited = np.zeros((h, w), dtype=bool)
queue = deque()
for x in range(w):
    queue.extend([(0, x), (h-1, x)])
for y in range(h):
    queue.extend([(y, 0), (y, w-1)])

while queue:
    y, x = queue.popleft()
    if visited[y, x]:
        continue
    visited[y, x] = True
    if dist[y, x] <= tol_total:
        mask[y, x] = True
        if y+1 < h and not visited[y+1, x]: queue.append((y+1, x))
        if y-1 >= 0 and not visited[y-1, x]: queue.append((y-1, x))
        if x+1 < w and not visited[y, x+1]: queue.append((y, x+1))
        if x-1 >= 0 and not visited[y, x-1]: queue.append((y, x-1))

print(f"BG coverage: {mask.sum()/(w*h)*100:.1f}%")

# --- Protect subject: fill holes inside the subject region ---
filled = ndi.binary_fill_holes(~mask)
holes_fixed = filled & mask
print(f"Holes filled inside subject: {holes_fixed.sum()} px")

alpha = np.where(mask, 0, 255).astype(np.uint8)

# Feather edges only (1px blur)
alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(1.0))
alpha_f = np.array(alpha_img).astype(np.float32)

out = img.convert("RGBA")
out.putalpha(Image.fromarray(alpha_f.astype(np.uint8)))
out.save(dst)

a = np.array(out.getchannel("A"))
total = w * h
print(f"Transparent: {(a<10).sum()/total*100:.1f}% | Opaque: {(a>245).sum()/total*100:.1f}%")
face = a[int(h*0.3):int(h*0.5), int(w*0.35):int(w*0.65)]
print(f"Face alpha<50: {((face<50).sum()/face.size*100):.1f}% (must be ~0)")
print("Saved:", dst)

# Preview composite
bgimg = Image.new("RGBA", (w, h), (12, 12, 15, 255))
Image.alpha_composite(bgimg, out).convert("RGB").save("/home/z/my-project/scripts/cutout_preview.jpg", quality=85)
print("Preview saved")
