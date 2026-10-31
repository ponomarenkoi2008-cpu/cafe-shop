const fs = require('fs');
const path = require('path');

const name = process.argv[2] || 'cafe_shop_js';
const subDirs = ['src/ingredients', 'src/orders', 'tests', 'docs/write_offs'];

for (const dir of subDirs) {
  fs.mkdirSync(path.join(name, dir), { recursive: true });
}

fs.writeFileSync(
  path.join(name, 'README.md'),
  `# Модуль кофейни Node.js (${name})\n\nАвтоматизация бизнес-процессов.\n`
);

console.log(`✅ Структура кофейни на Node.js успешно создана: ${path.resolve(name)}`);
