`reveal.js` Single File Presentation
====================================

This repository creates a single HTML file that uses [reveal.js](https://github.com/hakimel/reveal.js).  See the live demo at:

> https://tbhartman.github.io/reveal.js-webpack-example/dist/index.html

It is based on [@rbi's example](https://github.com/rbi/reveal.js-webpack-example), but embeds the
webpack'd bundle into the HTML file, then loads that when the page is loaded.

It is, admittedly, a bit Frakenstein at the moment, but the basic process is:
  - bundle the JS/CSS using webpack
    - including desired plugins.  currently:
      - markdown
      - math
      - notes
      - highlight
  - gzip that bundle and embed it in the HTML file as base64 data
  - on page load, the base64 data is decoded, decompressed, and `eval`'d
  - once the Reveal initialization is completed, a `RevealJSLoaded` event is triggered on `window`

Additionally, I wanted to be able to run this in presentation mode.  Reveal
provides for this, although [mentions](https://revealjs.com/speaker-view/)
that it must be run from a webserver.  Therefore, I also embed a Python
script into the HTML document so that I can serve the file from Python's
`http.server`.  This involves more shenanigans:
  - a comment before the `DOCTYPE` header is permissible, so I add it
  - for the Python parser, I enclose the entire HTML document in triple quotes
  - after the closing triple quotes at the end of the document, I close
    the HTML comment after starting the line as a Python comment
  - `package.py` embeds both `main.js` and itself into the HTML document
    as base64 encoded gzipped data.  It adds nominal Python to decode the base64,
    decompress it, and `exec` it.
Therefore, you can run the HTML file as:

    $ py -x slideshow.html -h
    usage: slideshow.html [-h] [--port PORT]

    options:
    -h, --help            show this help message and exit
    --port PORT, -p PORT

Usage
-----

Navigate to the [demo](https://tbhartman.github.io/reveal.js-webpack-example/dist/index.html) and save it to a local file.

Development
-----------

### How to Build

```
npm run build
```
