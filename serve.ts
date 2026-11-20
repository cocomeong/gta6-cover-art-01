// Serves the cover maker locally for a quick try: `node serve.ts`,
// then open http://localhost:8080. Static files only, Node standard
// library only — it is a dev helper, not part of the graded app.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = join(fileURLToPath(new URL('.', import.meta.url)), 'app');
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
};

createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    let file = normalize(join(appDir, decodeURIComponent(path)));
    if (!file.startsWith(appDir)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (file.endsWith('/')) file = join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(8080, () => console.log('Neon Sunset Cover Maker at http://localhost:8080'));
