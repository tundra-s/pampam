const HtmlWebpackPlugin = require("html-webpack-plugin");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3020,
  },
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => `
        <html>
          <head>
            ${htmlWebpackPlugin.tags.headTags}
            <style> 
              * {
                margin: 0;
                padding: 0;
              }
        
              body {
                overflow: hidden;
              }
        
              .info {
                position: absolute;
                top: 0;
                right: 0;
                background-color: rgb(30, 30, 30);
                padding: 10px;
                color: rgb(255, 255, 255);
                font-family: Arial, Helvetica, sans-serif;
              }
        
              .info_line {
                padding: 3px;
              }
            </style>
          </head>
          <body>
            ${htmlWebpackPlugin.tags.bodyTags}
          </body>
        </html>
      `,
    }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
    }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
