#!/usr/bin/env python3
"""Optimize portfolio images for web."""
from PIL import Image
import os

# Optimize cutout - quantize to reduce size while keeping alpha
src = "/home/z/my-project/public/images/profile-cutout.png"
img = Image.open(src).convert("RGBA")
print("Original:", img.size, os.path.getsize(src)//1024, "KB")

# Quantize with alpha preserved
q = img.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG)
q.save(src, optimize=True)
new_size = os.path.getsize(src)//1024
print("Quantized:", q.size, new_size, "KB")

# Also create a smaller hero-framed original for the ID card use
orig = Image.open("/home/z/my-project/public/images/profile.png").convert("RGB")
orig.thumbnail((800, 1000))
orig.save("/home/z/my-project/public/images/profile-card.jpg", quality=88, optimize=True)
print("Card version:", orig.size, os.path.getsize("/home/z/my-project/public/images/profile-card.jpg")//1024, "KB")

# Verify cutout still valid
check = Image.open(src)
print("Cutout final mode:", check.mode, "size:", check.size)
