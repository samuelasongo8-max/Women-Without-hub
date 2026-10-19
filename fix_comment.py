import io

p = "src/sections/WhyThisMatters.css"
with open(p, encoding="utf-8") as f:
    s = f.read()

old = "Solid teal band, white text, plain dividers \u2014 no cards."
new = "Solid orange band with a white heading and three white rounded cards with blue icons."

if old in s:
    s = s.replace(old, new, 1)
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)
    print("comment updated OK")
else:
    print("old comment NOT FOUND")
