/* Resize public/fallback.png into PWA + favicon assets. Run: npm run icons */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const SOURCE = path.join(__dirname, "..", "public", "fallback.png");
const OUT_DIR = path.join(__dirname, "..", "public");

function centerCropSquare(source) {
  const size = Math.min(source.width, source.height);
  const x0 = Math.floor((source.width - size) / 2);
  const y0 = Math.floor((source.height - size) / 2);
  const cropped = new PNG({ width: size, height: size });

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const si = ((y + y0) * source.width + (x + x0)) << 2;
      const di = (y * size + x) << 2;
      cropped.data[di] = source.data[si];
      cropped.data[di + 1] = source.data[si + 1];
      cropped.data[di + 2] = source.data[si + 2];
      cropped.data[di + 3] = source.data[si + 3];
    }
  }

  return cropped;
}

function resizeBox(source, targetSize) {
  const png = new PNG({ width: targetSize, height: targetSize });
  const sw = source.width;
  const sh = source.height;

  for (let ty = 0; ty < targetSize; ty++) {
    for (let tx = 0; tx < targetSize; tx++) {
      const x0 = Math.floor((tx * sw) / targetSize);
      const x1 = Math.max(x0 + 1, Math.ceil(((tx + 1) * sw) / targetSize));
      const y0 = Math.floor((ty * sh) / targetSize);
      const y1 = Math.max(y0 + 1, Math.ceil(((ty + 1) * sh) / targetSize));

      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const si = (sy * sw + sx) << 2;
          r += source.data[si];
          g += source.data[si + 1];
          b += source.data[si + 2];
          a += source.data[si + 3];
          count += 1;
        }
      }

      const di = (ty * targetSize + tx) << 2;
      png.data[di] = Math.round(r / count);
      png.data[di + 1] = Math.round(g / count);
      png.data[di + 2] = Math.round(b / count);
      png.data[di + 3] = Math.round(a / count);
    }
  }

  return png;
}

function writePng(outPath, png) {
  fs.writeFileSync(outPath, PNG.sync.write(png));
}

if (!fs.existsSync(SOURCE)) {
  console.error("Missing source image:", SOURCE);
  process.exit(1);
}

const source = PNG.sync.read(fs.readFileSync(SOURCE));
const square = centerCropSquare(source);

const outputs = [
  { name: "favicon-32.png", size: 32 },
  { name: "logo192.png", size: 192 },
  { name: "logo512.png", size: 512 },
];

for (const { name, size } of outputs) {
  const outPath = path.join(OUT_DIR, name);
  writePng(outPath, resizeBox(square, size));
  console.log("Wrote", outPath);
}
