/* One-off: solid #1b1b2f tiles matching site theme. Run: node scripts/generate-pwa-icons.cjs */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

function writeSolidPng(outPath, size, r, g, b) {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (size * y + x) << 2;
      png.data[i] = r;
      png.data[i + 1] = g;
      png.data[i + 2] = b;
      png.data[i + 3] = 255;
    }
  }
  const buf = PNG.sync.write(png);
  fs.writeFileSync(outPath, buf);
}

const pub = path.join(__dirname, "..", "public");
writeSolidPng(path.join(pub, "logo192.png"), 192, 27, 27, 47);
writeSolidPng(path.join(pub, "logo512.png"), 512, 27, 27, 47);
console.log("Wrote public/logo192.png and public/logo512.png");
