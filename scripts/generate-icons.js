import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function createPng(width, height) {
  // RGBA buffer: 1 filter byte (0) per row + width * 4 bytes
  const rowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rowLen * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep navy gradient (#0f172a to #1e3a8a)
      const gradT = y / height;
      let r = Math.round(15 + gradT * 15);
      let g = Math.round(23 + gradT * 35);
      let b = Math.round(42 + gradT * 96);
      let a = 255;

      // Outer glowing ring
      if (Math.abs(dist - radius) < width * 0.02) {
        r = 59; g = 130; b = 246; // Blue accent
      }

      // Draw Letter 'I' and 'T' block
      const normX = (x - cx) / (width * 0.5);
      const normY = (y - cy) / (height * 0.5);

      // 'I': from normX -0.6 to -0.2, normY -0.5 to 0.5
      const inI = (normX >= -0.55 && normX <= -0.35 && normY >= -0.45 && normY <= 0.45) ||
                  (normX >= -0.65 && normX <= -0.25 && ((normY >= -0.45 && normY <= -0.32) || (normY >= 0.32 && normY <= 0.45)));

      // 'T': top bar normX 0.0 to 0.65, normY -0.45 to -0.32; vertical stem normX 0.22 to 0.42, normY -0.32 to 0.45
      const inT = (normX >= -0.05 && normX <= 0.60 && normY >= -0.45 && normY <= -0.32) ||
                  (normX >= 0.17 && normX <= 0.37 && normY >= -0.32 && normY <= 0.45);

      if (inI || inT) {
        // Gold / Yellow brand color
        r = 245; g = 158; b = 11; a = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression method (deflate)
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method (none)

  const compressedData = zlib.deflateSync(rawData);

  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve(process.cwd(), 'public');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.join(outDir, 'icon-512-maskable.png'), createPng(512, 512));
fs.writeFileSync(path.join(outDir, 'favicon.png'), createPng(64, 64));

console.log('Generated icon-192.png, icon-512.png, icon-512-maskable.png, favicon.png successfully!');
