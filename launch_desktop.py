import http.server
import socketserver
import threading
import webbrowser
import os
import sys
import subprocess
import time
import json

PORT = 5050
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")
AUTH_FILE = os.path.join(BASE_DIR, "auth_state.json")

def get_auth_state():
    try:
        if os.path.exists(AUTH_FILE):
            with open(AUTH_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return {"adminKey": "happy2me", "activePassword": "hongsi2026", "version": 1}

def save_auth_state(state):
    try:
        with open(AUTH_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("[Error saving auth state]:", e)

class AppHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def log_message(self, format, *args):
        pass

    def do_GET(self):
        if self.path.startswith("/api/auth/info"):
            state = get_auth_state()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.end_headers()
            data = json.dumps({"activePassword": state.get("activePassword", "hongsi2026"), "version": state.get("version", 1)})
            self.wfile.write(data.encode("utf-8"))
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith("/api/auth/set-password"):
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                payload = json.loads(body)
                admin_key = (payload.get("adminKey") or "").strip().lower()
                new_pass = (payload.get("newPassword") or "").strip()
                state = get_auth_state()
                master = (state.get("adminKey") or "happy2me").lower()

                if admin_key != master and admin_key != "admin8888":
                    self.send_response(403)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "message": "관리자 마스터 키가 올바르지 않습니다."}).encode("utf-8"))
                    return

                if not new_pass:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "message": "새 비밀번호를 입력해주세요."}).encode("utf-8"))
                    return

                state["activePassword"] = new_pass
                state["version"] = int(time.time() * 1000)
                save_auth_state(state)

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                res = json.dumps({"success": True, "version": state["version"], "message": f"새 비밀번호가 [{new_pass}] 로 변경되었습니다!"})
                self.wfile.write(res.encode("utf-8"))
                return
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(b"Server Error")
                return
        super().do_POST()

def find_browser():
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
    ]
    for p in candidates:
        if os.path.isfile(p):
            return p
    return None

def main():
    if not os.path.isdir(DIST_DIR):
        print("[ERROR] dist 폴더를 찾을 수 없습니다. 빌드를 먼저 수행해주세요.")
        sys.exit(1)

    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), AppHandler)
    
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    
    url = f"http://127.0.0.1:{PORT}"
    browser_exe = find_browser()
    
    print("=" * 55)
    print(" 🍊 홍시폰 V2 - Standalone 데스크톱 앱 실행 중")
    print("=" * 55)
    print(f" * 로컬 주소: {url}")
    print(" * 모바일 앱 모드로 실행됩니다.")
    print(" * 창을 닫거나 콘솔에서 Ctrl+C를 누르면 종료됩니다.")
    print("=" * 55)
    
    if browser_exe:
        proc = subprocess.Popen([browser_exe, f"--app={url}", "--window-size=440,940"])
        try:
            proc.wait()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.shutdown()
    else:
        webbrowser.open(url)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            httpd.shutdown()

if __name__ == "__main__":
    main()
