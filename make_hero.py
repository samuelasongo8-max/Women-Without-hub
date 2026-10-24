from PIL import Image

src = Image.open('public/images/our-program-at-women-without-hub.jpg').convert('RGB')
w, h = src.size
# center crop to 16:9
target = w / (16 / 9)
if target < h:
    top = (h - target) / 2
    src = src.crop((0, top, w, top + target))
else:
    left = (w - h * (16 / 9)) / 2
    src = src.crop((left, 0, left + h * (16 / 9), h))
src = src.resize((1600, 900), Image.LANCZOS)
src.save('public/images/about-hero.jpg', quality=88, optimize=True)
src.save('public/images/about-hero.webp', quality=85, method=6)
print('saved', src.size)
