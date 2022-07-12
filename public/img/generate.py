import numpy as np
from PIL import Image


data = np.zeros((1000, 2000, 3), dtype=np.uint8)

#bands
for i in range(40):
    data[i] = 173
    data[1000 - i - 1] = 173

for step in range(1000 // 40):
    if step % 2 == 1:
        data[step * 40: (step + 1) * 40, 1000 - 20: 1000 + 20] = 173

img = Image.fromarray(data)
img.show()
img.save('background.jpg')
