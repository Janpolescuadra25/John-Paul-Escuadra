#!/usr/bin/env python3
"""Flood-fill based background removal - works well on uniform studio backgrounds."""
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

src = "/home/z/my-project/public/images/profile.png"
dst = "/home/z/my-project/public/images/profile-cutout.png"

print("Loading...")
img = Image.open(src).convert("RGB")
img.thumbnail((900, 1120))  # downscale for speed & web use
w, h = img.size
print("Working size:", img.size)

arr = np.array(img).astype(np.int32)

# Sample background color from corners
corners = [
    arr[2, 2], arr[2, w-3], arr[h-3, 2], arr[h-3, w-3],
    arr[2, w//2], arr[h//2, 2], arr[h//2, w-3],
]
bg = np.mean(corners, axis=0)
print("Background color:", bg)

# Tolerance for background match (per-channel distance)
tolerance = 38

# Flood fill from all edge pixels
mask = np.zeros((h, w), dtype=bool)  # True = background
visited = np.zeros((h, w), dtype=bool)
queue = deque()

# Seed all edge pixels that look like background
for x in range(w):
    for y in (0, h-1):
        if not visited[y, x]:
            queue.append((y, x))
for y in range(h):
    for x in (0, w-1):
        if not visited[y, x]:
            queue.append((y, x))

dist = np.abs(arr - bg).sum(axis=2)  # color distance from bg

while queue:
    y, x = queue.popleft()
    if visited[y, x]:
        continue
    visited[y, x] = True
    if dist[y, x] <= tolerance * 3:
        mask[y, x] = True
        for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny, nx = y+dy, x+dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                queue.append((ny, nx))

print(f"Background coverage: {mask.sum()/(w*h)*100:.1f}%")

# Create alpha channel with feathered edges
alpha = np.where(mask, 0, 255).astype(np.uint8)
alpha_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(1.2))
alpha_f = np.array(alpha_img).astype(np.float32)

# Slight cleanup: remove small transparent islands inside subject (fill holes)
from scipy import ndimage as ndi
try:
    filled = ndi.binary_fill_holes(~mask)
    # restore
    fix = filled & mask
    alpha_f[fix] = np.maximum(alpha_f[fix], 180)
except Exception as e:
    print("scipy skip:", e)

out = img.convert("RGBA")
out.putalpha(Image.fromarray(alpha_f.astype(np.uint8)))
out.save(dst)

# Report
a = np.array(out.getchannel("A"))
total = w * h
print(f"Transparent: {(a < 10).sum()/total*100:.1f}% | Opaque: {(a > 245).sum()/total*100:.1f}% | Edge px: {((a >= 10) & (a <= 245)).sum()}")
print("Saved:", dst)
