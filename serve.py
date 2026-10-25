"""Local dev server that disables browser caching so edits to config.json/index.html show on reload.

Serves only the public/ folder (the deployable website); development files stay outside it.

Page URLs without a file extension (/privacy-policy, /blog, /abc123, ...) are answered with
index.html so the client-side router can show the right page, or the custom 404.

Security: listens on 127.0.0.1 only (not reachable from the network), never serves
hidden files such as .git, the server scripts, or directory listings, and sends the
same security headers as the production _headers file.
"""
import functools
import http.server
import os
import posixpath
import urllib.parse

HOST = "127.0.0.1"
PORT = 8080

# Files that exist in the project folder but must never be served.
BLOCKED_SUFFIXES = (".py", ".bat", ".cmd", ".ps1", ".sh", ".md")

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' https://fonts.googleapis.com; "
        "style-src-attr 'unsafe-inline'; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data:; "
        "connect-src 'self' https://api.web3forms.com; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "form-action 'self'; "
        "frame-ancestors 'self'"
    ),
}


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    server_version = "AIB-dev"
    sys_version = ""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        for name, value in SECURITY_HEADERS.items():
            self.send_header(name, value)
        super().end_headers()

    def send_head(self):
        path = posixpath.normpath(urllib.parse.unquote(urllib.parse.urlsplit(self.path).path))
        parts = [p for p in path.split("/") if p]
        if any(p.startswith(".") for p in parts) or path.lower().endswith(BLOCKED_SUFFIXES):
            self.send_error(404, "File not found")
            return None
        if not os.path.exists(self.translate_path(self.path)) and not posixpath.splitext(path)[1]:
            self.path = "/index.html"
        return super().send_head()

    def list_directory(self, path):
        # No directory listings: folders without an index.html are simply "not found".
        self.send_error(404, "File not found")
        return None


if __name__ == "__main__":
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
    handler = functools.partial(NoCacheHandler, directory=root)
    with http.server.ThreadingHTTPServer((HOST, PORT), handler) as httpd:
        print(f"Serving {root} at http://localhost:{PORT}/ (local only, caching disabled)")
        httpd.serve_forever()
