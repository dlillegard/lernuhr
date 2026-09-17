import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/digitaluhr.html': ['digitaluhr.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/theme.js': ['theme.js', 'text/javascript; charset=utf-8'],
  '/clock-core.js': ['clock-core.js', 'text/javascript; charset=utf-8'],
  '/analog.js': ['analog.js', 'text/javascript; charset=utf-8'],
  '/digital.js': ['digital.js', 'text/javascript; charset=utf-8'],
  '/lernuhr-symbol.svg': ['lernuhr-symbol.svg', 'image/svg+xml']
};

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const file = files[(request.url || '/').split('?')[0]];
  if (!file) {
    response.writeHead(404).end('Ikke funnet');
    return;
  }
  try {
    const body = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, {
      'Content-Type': file[1],
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500).end('Kunne ikke lese filen.');
  }
});

server.listen(5174, '127.0.0.1', () => console.log('Lernuhr: http://127.0.0.1:5174'));
