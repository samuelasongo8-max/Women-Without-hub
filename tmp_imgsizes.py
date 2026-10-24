from PIL import Image
import glob, os
for f in sorted(glob.glob('public/images/*.jpg') + glob.glob('public/images/*.jpeg') + glob.glob('public/images/*.png')):
    try:
        im = Image.open(f)
        print(os.path.basename(f), im.size, im.mode)
    except Exception as e:
        print(os.path.basename(f), 'ERR', e)
