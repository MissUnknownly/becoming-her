"""Startet Becoming Her lokal unter http://localhost:5173 (optional – index.html funktioniert auch per Doppelklick)."""
import http.server, os, socketserver, webbrowser

PORT = 5173
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Becoming Her läuft auf http://localhost:{PORT}  (Beenden mit Strg+C)")
    if os.environ.get("BH_NO_BROWSER") != "1":
        webbrowser.open(f"http://localhost:{PORT}")
    httpd.serve_forever()
