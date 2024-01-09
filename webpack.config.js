const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory path
    publicPath: '/', // Public URL path for client-side routing
    filename: 'bundle.js', // Output bundle filename
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Directory for static files
    },
    port: 8080, // Dev server port
    historyApiFallback: true, // Enable HTML5 History API support
    open: true, // Open the browser after server start
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your index.html template
      filename: 'index.html', // Output filename in the 'dist' directory
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add other rules if needed
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // File extensions to process
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'), // Polyfill for 'path' module
      os: require.resolve('os-browserify/browser'), // Polyfill for 'os' module
      stream: require.resolve('stream-browserify'), // Polyfill for 'stream' module
      buffer: require.resolve('buffer'), // Polyfill for 'buffer' module
      crypto: require.resolve('crypto-browserify'), // Polyfill for 'crypto' module

    },
  },
};
