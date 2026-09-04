"""Verify the click-pulse interaction fired by comparing screenshots."""
from PIL import Image, ImageChops
import os

shots = "/home/z/my-project/scripts/shots"

a = Image.open(f"{shots}/02-cursor-links.png").convert("RGB")
b = Image.open(f"{shots}/03-pulse-fired.png").convert("RGB")
print("sizes:", a.size, b.size)

# 1) mean absolute difference — pulse should create a large localized change
import math
diff = ImageChops.difference(a, b)
stat = [sum(ch) / (a.size[0] * a.size[1]) for ch in zip(*diff.getextrema())]  # not used
hist = diff.convert("L").histogram()
total = a.size[0] * a.size[1]
changed = sum(hist[8:])  # pixels with L-diff >= 8
print(f"changed pixels (>=8 L-diff): {changed} ({100 * changed / total:.2f}%)")

# 2) locate the strongest change region (should be near click 880,320)
gray_a = a.convert("L")
gray_b = b.convert("L")
w, h = a.size
px_a, px_b = gray_a.load(), gray_b.load()
cell = 60
best = (0, 0, 0)
for gx in range(0, w - cell, cell):
    for gy in range(0, h - cell, cell):
        s = 0
        for x in range(gx, gx + cell, 12):
            for y in range(gy, gy + cell, 12):
                s += abs(px_a[x, y] - px_b[x, y])
        if s > best[2]:
            best = (gx, gy, s)
print(f"strongest change cell: x={best[0]}, y={best[1]} score={best[2]} (click was at 880,320)")

# 3) emerald presence near click in shot 03 (green > red and green > blue strongly)
rgb = b.load()
em = 0
for x in range(700, 1100, 6):
    for y in range(160, 480, 6):
        r, g, bl = rgb[x, y]
        if g > 150 and g - r > 40 and g - bl > 40:
            em += 1
print(f"emerald-ish pixels near click: {em}")

# 4) hint chip presence in hero shot (bottom right area should be non-white)
hero = Image.open(f"{shots}/01-desktop-hero.png").convert("RGB")
hp = hero.load()
nonwhite = 0
for x in range(w - 420, w - 40, 4):
    for y in range(h - 120, h - 40, 4):
        r, g, bl = hp[x, y]
        if r < 245 or g < 245 or bl < 245:
            nonwhite += 1
print(f"non-white pixels in bottom-right (hint chip zone): {nonwhite}")
