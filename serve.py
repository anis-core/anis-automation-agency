"""Local dev server that disables browser caching so edits to config.json/index.html show on reload.

Page URLs without a file extension (/privacy-policy, /blog, /abc123, ...) are answered with
index.html so the client-side router can show the right page, or the custom 404.
"""
import functools
import http.server
import os
import posixpath
import urllib.parse

PORT = 8080


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        path = urllib.parse.urlsplit(self.path).path
        if not os.path.exists(self.translate_path(self.path)) and not posixpath.splitext(path)[1]:
            self.path = "/index.html"
        return super().send_head()


if __name__ == "__main__":
    root = os.path.dirname(os.path.abspath(__file__))
    handler = functools.partial(NoCacheHandler, directory=root)
    with http.server.ThreadingHTTPServer(("", PORT), handler) as httpd:
        print(f"Serving {root} at http://localhost:{PORT}/ (caching disabled)")
        httpd.serve_forever()
