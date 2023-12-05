const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    publicPath: "",
    path: path.resolve(__dirname, 'dist')
  },
  performance: {
    maxAssetSize: 400000,
  },
  module: {
    rules: [
      // {
      //   test: /\.(ttf|woff|eot)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // },
      {
        test: /\.css$/,
        use:[
          {
            loader: "style-loader",
            options: {
              injectType: "styleTag",
              styleTagTransform: (css, style, options)=>{
                // note: this order must match that in index.js
                const cssOrder = {
                  0: "black",
                  1: "white",
                  2: "league",
                  3: "beige",
                  4: "night",
                  5: "serif",
                  6: "simple",
                  7: "solarized",
                  8: "moon",
                  9: "dracula",
                  10: "sky",
                  11: "blood",
                };
                let m = css.substr(0,300).match("\\* (.*?) theme for reveal.js");
                if( m ) {
                  if( window._last_webpack_css_theme != undefined ) {
                    window._last_webpack_css_theme++;
                  } else {
                    window._last_webpack_css_theme = 0
                  }
                  console.log("Loaded '" + cssOrder[window._last_webpack_css_theme] + "' reveal.js theme.");
                }
                if( window._last_webpack_css_theme != undefined ) {
                  style.setAttribute("media", "none");
                  style.classList.add("revealTheme-" + cssOrder[window._last_webpack_css_theme]);
                }
                style.innerHTML = css;
              },
              insert: (element)=>{
                var parent = document.querySelector("head");
                // eslint-disable-next-line no-underscore-dangle
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({template: 'index.html'})
  ]
};
