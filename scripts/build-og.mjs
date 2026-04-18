import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(resolve(root, 'public/og-image.svg'));
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, background: '#2666e1' });
const png = resvg.render().asPng();
const out = resolve(root, 'public/og-image.png');
writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length} bytes)`);
