// Renderiza los recursos de marca a PNG con Chromium (Playwright).
// Uso: node brand/src/render-brand.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const page_url = 'file://' + path.join(here, 'brand.html');

const views = [
  { view: 'logo', w: 1600, h: 1600, file: 'logo.png', transparent: true },
  { view: 'logo-dark', w: 2400, h: 900, file: 'logo-horizontal.png' },
  { view: 'avatar', w: 800, h: 800, file: 'perfil-800x800.png' },
  { view: 'banner', w: 2560, h: 1440, file: 'banner-2560x1440.png' },
  { view: 'watermark', w: 150, h: 150, file: 'marca-agua-150x150.png', transparent: true },
  { view: 'sheet', w: 1920, h: 1080, file: 'identidad-visual.png' },
];

const browser = await chromium.launch();
for (const v of views) {
  const page = await browser.newPage({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
  await page.goto(`${page_url}?view=${v.view}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.locator('#' + v.view).screenshot({ path: path.join(out, v.file), omitBackground: !!v.transparent });
  console.log('✓', v.file);
  await page.close();
}
await browser.close();
