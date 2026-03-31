import struct, zlib
from collections import Counter

with open('public/images/elite_logo_blue.png', 'rb') as f:
    data = f.read()

pos = 8
ihdr_data = None
idat_list = []
while pos < len(data):
    length = struct.unpack('>I', data[pos:pos+4])[0]
    ctype = data[pos+4:pos+8].decode('latin1')
    cdata = data[pos+8:pos+8+length]
    if ctype == 'IHDR':
        ihdr_data = cdata
    elif ctype == 'IDAT':
        idat_list.append(cdata)
    pos += 12 + length

raw = zlib.decompress(b''.join(idat_list))
w = struct.unpack('>I', ihdr_data[0:4])[0]
h = struct.unpack('>I', ihdr_data[4:8])[0]

stride = w * 4 + 1
buckets = Counter()
for row in range(h):
    base = row * stride + 1
    for col in range(0, w*4, 4):
        r, g, b, a = raw[base+col], raw[base+col+1], raw[base+col+2], raw[base+col+3]
        if a > 150 and not (r > 220 and g > 220 and b > 220):
            buckets[(r//20*20, g//20*20, b//20*20)] += 1

print("Top brand colors from logo (non-white opaque pixels):")
for color, count in buckets.most_common(15):
    print(f'  #{color[0]:02X}{color[1]:02X}{color[2]:02X}  (count={count})')
