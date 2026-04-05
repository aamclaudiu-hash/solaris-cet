import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = fs.readdirSync(dir);
  for (let file of files) {
    let p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      let content = fs.readFileSync(p, 'utf8');
      let replaced = content.replace(/z-50/g, 'z-[9999]').replace(/z-\[1100\]/g, 'z-[9999]');
      if (content !== replaced) {
        fs.writeFileSync(p, replaced);
        console.log('Fixed:', p);
      }
    }
  }
}
walk('app/src/components/ui');
