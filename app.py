"""
AgriSmart Ultra - Unified Application Launcher
Run with:
    py app.py
or:
    python app.py
"""

import sys
import threading
import http.server
import socketserver
import urllib.request
import urllib.error
from pathlib import Path

# Fix Windows console UTF-8 output if needed
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Paths setup
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"

# Avoid module name collision between app.py launcher and backend/app package
if str(ROOT_DIR) in sys.path:
    sys.path.remove(str(ROOT_DIR))
if "" in sys.path:
    sys.path.remove("")
if "." in sys.path:
    sys.path.remove(".")
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

PORT_VITE = 5173
PORT_BACKEND = 8000
TARGET_URL = f"http://127.0.0.1:{PORT_BACKEND}"

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Quiet logging

    def do_GET(self):
        self._proxy()
    def do_POST(self):
        self._proxy()
    def do_HEAD(self):
        self._proxy()
    def do_OPTIONS(self):
        self._proxy()

    def _proxy(self):
        url = TARGET_URL + self.path
        body = None
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            body = self.rfile.read(content_length)

        headers = {k: v for k, v in self.headers.items() if k.lower() not in ['host', 'connection']}
        req = urllib.request.Request(url, data=body, headers=headers, method=self.command)

        try:
            with urllib.request.urlopen(req) as resp:
                self.send_response(resp.status)
                for k, v in resp.getheaders():
                    if k.lower() not in ['transfer-encoding', 'content-length', 'connection']:
                        self.send_header(k, v)
                content = resp.read()
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for k, v in e.headers.items():
                if k.lower() not in ['transfer-encoding', 'content-length', 'connection']:
                    self.send_header(k, v)
            content = e.read()
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception:
            self.send_response(502)
            self.end_headers()

def start_5173_proxy():
    try:
        socketserver.TCPServer.allow_reuse_address = True
        with socketserver.TCPServer(("127.0.0.1", PORT_VITE), ProxyHandler) as httpd:
            httpd.serve_forever()
    except Exception:
        pass

if __name__ == "__main__":
    import uvicorn
    from app.main import app

    # Start Vite port proxy in background thread
    proxy_thread = threading.Thread(target=start_5173_proxy, daemon=True)
    proxy_thread.start()

    print("\n" + "=" * 65)
    print(" [AgriSmart Ultra Application Server]")
    print("=" * 65)
    print(f" * Web App Live (Primary):    http://127.0.0.1:{PORT_BACKEND}")
    print(f" * Web App Live (Vite Port):  http://127.0.0.1:{PORT_VITE}")
    print(f" * Interactive API Swagger:   http://127.0.0.1:{PORT_BACKEND}/docs")
    print("=" * 65 + "\n")

    uvicorn.run(app, host="127.0.0.1", port=PORT_BACKEND, reload=False)
