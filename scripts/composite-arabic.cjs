const { execSync } = require('child_process');
const path = require('path');

const WIDTH = 896;
const HEIGHT = 1200;

const bgPath = 'src/assets/images/dark_luxury_podium_1790425206193.jpg';

const items = [
  {
    name: 'carousel-arabes-asad.jpg',
    src: 'public/products/lattafa-asad.png',
    bottleHeight: 660,
    pedestalY: 795,
    shadowWidth: 260,
    shadowHeight: 30
  },
  {
    name: 'carousel-arabes-clubdenuit.jpg',
    src: 'public/products/armaf-club-de-nuit-intense-man.png',
    bottleHeight: 610,
    pedestalY: 795,
    shadowWidth: 300,
    shadowHeight: 30
  },
  {
    name: 'carousel-arabes-sabah.jpg',
    src: 'public/products/sabah-al-ward.png',
    bottleHeight: 640,
    pedestalY: 795,
    shadowWidth: 280,
    shadowHeight: 30
  }
];

for (const item of items) {
  const outPath = path.join('public/products', item.name);
  console.log(`Compositing ${item.name} cleanly onto podium...`);

  // 1. Trim transparency and resize bottle to target height
  const bottleResized = `/tmp/bottle_clean_${item.name}.png`;
  execSync(`convert "${item.src}" -trim +repage -resize x${item.bottleHeight} "${bottleResized}"`);

  // Measure bottle dimensions
  const dims = execSync(`identify -format "%w %h" "${bottleResized}"`).toString().trim().split(' ');
  const bw = parseInt(dims[0]);
  const bh = parseInt(dims[1]);
  const bx = Math.round((WIDTH - bw) / 2);
  const by = item.pedestalY - bh;

  // 2. Realistic subtle soft contact shadow right under the base of the bottle
  const shadowFile = `/tmp/contact_shadow_${item.name}.png`;
  const sx = Math.round((WIDTH - item.shadowWidth) / 2);
  const sy = item.pedestalY - Math.round(item.shadowHeight / 2) - 4;

  execSync(`
    convert -size ${WIDTH}x${HEIGHT} xc:none \\
      \\( -size ${item.shadowWidth}x${item.shadowHeight} xc:black -blur 0x14 \\) -geometry +${sx}+${sy} -composite \\
      \\( -size ${Math.round(item.shadowWidth * 0.7)}x${Math.round(item.shadowHeight * 0.5)} xc:black -blur 0x5 \\) -geometry +${Math.round((WIDTH - item.shadowWidth*0.7)/2)}+${sy + 2} -composite \\
      "${shadowFile}"
  `);

  // 3. Composite cleanly: Background + Shadow + Bottle
  // NO artificial reflection box, NO white border, 100% clean presentation
  execSync(`
    convert "${bgPath}" \\
      "${shadowFile}" -compose multiply -composite \\
      "${bottleResized}" -geometry +${bx}+${by} -compose over -composite \\
      -quality 95 "${outPath}"
  `);

  console.log(`Generated pristine ${outPath}`);
}

console.log('All composite carousel images regenerated successfully without any white borders!');
