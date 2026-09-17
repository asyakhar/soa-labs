const fs = require('node:fs');
const path = require('node:path');
const source = path.dirname(require.resolve('swagger-ui-dist/package.json'));
fs.mkdirSync('vendor/swagger-ui', { recursive: true });
for (const name of ['swagger-ui.css', 'swagger-ui-bundle.js', 'swagger-ui-standalone-preset.js', 'LICENSE', 'NOTICE']) {
  fs.copyFileSync(path.join(source, name), path.join('vendor/swagger-ui', name));
}
console.log('Swagger UI 5.33.0 скопирован в vendor/swagger-ui');
