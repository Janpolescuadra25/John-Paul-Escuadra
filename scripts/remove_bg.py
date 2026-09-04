#!/usr/bin/env python3
"""Remove background from profile picture for hero cutout."""
from rembg import remove
from PIL import Image
import os

src = "/home/z/my-project/public/images/profile.png"
dst = "/home/z/my-project/public/images/profile-cutout.png"

print("Loading image...")
inp = Image.open(src)

print("Removing background (this may take a minute)...")
output = remove(inp)

# Save with transparency
output.save(dst)

# Verify
result = Image.open(dst)
print("Saved:", dst, "size:", result.size, "mode:", result.mode)

# Check alpha coverage
if result.mode == "RGBA":
    alpha = result.getchannel("A")
    hist = alpha.histogram()
    transparent = sum(hist[:16])
    opaque = sum(hist[240:])
    total = result.size[0] * result.size[1]
    print(f"Transparent px: {transparent/total*100:.1f}% | Opaque px: {opaque/total*100:.1f}%")
print("DONE")
