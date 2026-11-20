// node render.cjs config.json  ->  renderiza la miniatura 1080x1920 con Chromium
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const c = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  let html = fs.readFileSync(path.join(__dirname, 'plantilla.html'), 'utf8')
    .replaceAll('FONTS/', 'file://' + c.fonts + '/').replace('FONDO', 'file://' + c.fondo)
    .replace('SIZE', String(c.size)).replace('ACENTO', c.acento).replace('TEXTO', c.texto).replace('HANDLE', c.handle);
  const tmp = c.salida + '.html'; fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: c.salida, type: 'jpeg', quality: 92 }); await b.close(); fs.unlinkSync(tmp);
})();
