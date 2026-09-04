#!/usr/bin/env python3
"""Flood-fill background removal v3 - bg sampled from clean top region."""
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

# --- Sample BG from TOP band + upper side bands only (subject body is at bottom) ---
top_band = arr[0:6, :].reshape(-1, 3)
upper_sides = np.concatenate([
    arr[0:int(h*0.35), 0:4].reshape(-1, 3),
    arr[0:int(h*0.35), w-4:].reshape(-1, 3),
])
samples = np.concatenate([top_band, upper_sides])
bg = np.median(samples, axis=0)
spread = np.abs(samples - bg).sum(axis=1)
print(f"BG median: {bg}, spread p50={np.percentile(spread,50):.0f} p95={np.percentile(spread,95):.0f}")

# Tolerance: bg spread + margin, but capped to protect skin (skin distance from bg ~55-90)
tol_total = min(140.0, max(45.0, np.percentile(spread, 95) * 1.5 + 12))
print(f"Tolerance: {tol_total:.0f}")

dist = np.abs(arr - bg).sum(axis=2)

# --- Flood fill from ALL edges (subject-touching edges simply won't match) ---
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

# --- Fill holes inside subject ---
filled = ndi.binary_fill_holes(~mask)
holes_fixed = filled & mask
print(f"Holes filled: {holes_fixed.sum()} px")

alpha = np.where(mask, 0, 255).astype(np.uint8)
alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(1.0))
alpha_f = np.array(alpha_img).astype(np.float32)

out = img.convert("RGBA")
out.putalpha(Image.fromarray(alpha_f.astype(np.uint8)))
out.save(dst)

a = np.array(out.getchannel("A"))
total = w * h
print(f"Transparent: {(a<10).sum()/total*100:.1f}% | Opaque: {(a>245).sum()/total*100:.1f}%")
face = a[int(h*0.3):int(h*0.5), int(w*0.35):int(w*0.65)]
print(f"Face alpha<50: {((face<50).sum()/face.size*100):.1f}% (target: <2%)")
torso = a[int(h*0.7):int(h*0.9), int(w*0.3):int(w*0.7)]
print(f"Torso opaque: {(torso>245).sum()/torso.size*100:.1f}% (target: >95%)")

bgimg = Image.new("RGBA", (w, h), (12, 12, 15, 255))
Image.alpha_composite(bgimg, out).convert("RGB").save("/home/z/my-project/scripts/cutout_preview.jpg", quality=85)
print("Preview saved")
