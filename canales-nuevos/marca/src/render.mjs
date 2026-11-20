import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)); const out = path.resolve(here, '..');
const url = 'file://' + path.join(here, 'marca.html');
const nombres = {1:'ahora-lo-entiendes',2:'escenario-imposible',3:'tu-cerebro-te-engana'};
const b = await chromium.launch();
for (const n of [1,2,3]) for (const [v,w,h,sc] of [['perfil',800,800,1],['banner',2560,1440,1],['banner',2560,1440,1.6]]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:sc });
  await p.goto(`${url}?v=${v}${n}`); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(400);
  const f = v==='perfil' ? `${nombres[n]}-perfil-800x800.png` : (sc===1?`${nombres[n]}-banner-2560x1440.png`:`${nombres[n]}-banner-4096x2304.png`);
  await p.locator('#'+v+n).screenshot({ path: path.join(out,f) }); console.log('✓',f); await p.close();
}
await b.close();
