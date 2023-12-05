import argparse
import functools
import gzip
import http.server
import socketserver
import threading
import time
import sys
import urllib.parse
import base64
import pathlib
import sys
import textwrap

@functools.lru_cache
def _get_self_bytes():
    with open(__file__, 'rb') as f:
        return f.read()

def package()->int:
    INDEX = pathlib.Path("index.html")
    MAIN = pathlib.Path("dist/main.js")
    LICENSE = pathlib.Path("dist/main.js.LICENSE.txt")

    OUTPUT = pathlib.Path("dist/index.html")

    print("Python packager")

    for f in (INDEX,MAIN,LICENSE):
        assert f.is_file(), f"{f.name} not found"
    with INDEX.open('rb') as f, MAIN.open('rb') as m, LICENSE.open() as l, OUTPUT.open('wb') as o:
        found_reveal_script = False
        for line in f:
            if line.strip() == b'<script id="reveal.js">':
                found_reveal_script = True
                o.write(line)
                o.write(l.read().encode())
                o.write(b"gunzip64(\n")
                assert m.readline().startswith(b'/'), f"expected {m.name} to have a comment on the first line"
                for b64line in base64.encodebytes(gzip.compress(m.readline())).splitlines():
                    o.write(b'  "' + b64line + b'" +\n')
                assert not m.readline(), f"expected {m.name} to have only two lines"
                o.write(b'  "").then(c=>eval(c));\n')
                continue
            o.write(line)
        assert found_reveal_script, 'failed to find <script id="reveal.js">'
        o.write(b"<!--\n")
        o.write(b'"""\n')
        o.write(b"import base64\n")
        o.write(b"import gzip\n")
        o.write(b'exec(gzip.decompress(base64.decodebytes(b"""\n')
        for b64line in base64.encodebytes(gzip.compress(_get_self_bytes())).splitlines():
            o.write(b64line + b"\n")
        o.write(b'"""\n')
        o.write(b")))\n")
        o.write(b"# -->\n")

    return 0

class MyHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self, *args):
      u = urllib.parse.urlparse(self.path)
      if u.path != "/":
          self.send_response(404)
          return
      self.send_response(200)
      self.send_header("Content-type", "text/html")
      self.end_headers()
      self.wfile.write(_get_self_bytes())
    def log_message(*args, **kwargs):
      pass
class WebServer(threading.Thread):
    def __init__(self):
        super().__init__(daemon=True)
        self.host = "localhost"
        self.ws = http.server.HTTPServer((self.host, args.port or 0), MyHandler)

    def run(self):
        print("started server at http://" + ":".join(map(str, self.ws.server_address)))
        self.ws.serve_forever(poll_interval=0.3)

    def shutdown(self):
        # set the two flags needed to shutdown the HTTP server manually
        self.ws._BaseServer__is_shut_down.set()
        self.ws.__shutdown_request = True

        self.ws.shutdown()
        self.ws.server_close()
        self.join()

if __name__ == "__main__":
    # this will either be run during the build, in which case __file__ ends with .py
    # or in production, in which case __file__ ends with .html
    if __file__.endswith(".py"):
        try:
            rc = package()
        except AssertionError as e:
            rc = 2
            if len(e.args) != 1:
                raise Exception("assertion raised without comment") from e
            print(f"error:\n  {e.args[0]}", file=sys.stderr)
        sys.exit(rc)
    else:
        p = argparse.ArgumentParser()
        p.add_argument("--port","-p", type=int, default=8080)
        args = p.parse_args()
        webServer = WebServer()
        webServer.start()
        while True:
            try:
                time.sleep(0.3)
            except KeyboardInterrupt:
                print('shutting down...')
                thread = threading.Thread(target=webServer.shutdown, daemon=True)
                thread.start()
                thread.join(timeout=1.5)
                if thread.is_alive():
                    print("  failed to kill server; forcefully exiting")
                else:
                    print("  done")
                sys.exit(0)

