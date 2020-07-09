const path = require('path');
var PORT= process.env.PORT || 9000
module.exports = {
  entry: './src/Main.ts',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: PORT
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool:"source-map",
  externals: [
      // Don't bundle pixi.js, assume it'll be included in the HTML via a script
      // tag, and made available in the global variable PIXI.
      {"pixi.js": "PIXI"}
  ]
};