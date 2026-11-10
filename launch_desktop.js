const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 5050;
const DIST_DIR = path.join(__dirname, 'dist');
const AUTH_FILE = path.join(__dirname, 'auth_state.json');

function getAuthState() {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { adminKey: 'happy2me', activePassword: 'hongsi2026', version: 1 };
}

function saveAuthState(state) {
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {}
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  if (req.url === '/api/auth/info' && req.method === 'GET') {
    const state = getAuthState();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    res.end(JSON.stringify({ activePassword: state.activePassword || 'hongsi2026', version: state.version || 1 }));
    return;
  }

  if (req.url === '/api/auth/set-password' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { adminKey, newPassword } = JSON.parse(body);
        const state = getAuthState();
        const cleanAdmin = (adminKey || '').trim().toLowerCase();
        const master = (state.adminKey || 'happy2me').toLowerCase();

        if (cleanAdmin !== master && cleanAdmin !== 'admin8888') {
          res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: '관리자 마스터 키가 올바르지 않습니다.' }));
          return;
        }

        if (!newPassword || !newPassword.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, message: '새 비밀번호를 입력해주세요.' }));
          return;
        }

        state.activePassword = newPassword.trim();
        state.version = Date.now();
        saveAuthState(state);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          version: state.version,
          message: `새 비밀번호가 [${state.activePassword}] 로 성공적으로 변경되었습니다!`,
        }));
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: '서버 오류' }));
      }
    });
    return;
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function findBrowser() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log('='.repeat(55));
  console.log(' 🍊 홍시폰 V2 - Standalone 데스크톱 앱 실행');
  console.log('='.repeat(55));
  console.log(` * 로컬 서버: ${url}`);
  console.log(' * 창을 닫으면 자동으로 앱이 종료됩니다.');
  console.log('='.repeat(55));

  const browser = findBrowser();
  if (browser) {
    const child = spawn(browser, [`--app=${url}`, '--window-size=440,940'], {
      detached: false,
      stdio: 'ignore'
    });
    child.on('exit', () => {
      server.close();
      process.exit(0);
    });
  } else {
    spawn('cmd', ['/c', 'start', url], { stdio: 'ignore' });
  }
});
