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
                let m = css.substr(0,300).match("\\* (.*?) theme for reveal.js");
                if( m ) {
                  window._last_webpack_css_theme = m[1].replace(" ", "");
                  console.log("Loaded " + m[1] + " reveal.js theme.");
                }
                if( window._last_webpack_css_theme ) {
                  style.setAttribute("media", "none");
                  style.classList.add("revealTheme" + window._last_webpack_css_theme);
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
