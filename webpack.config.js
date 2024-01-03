const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Точка входа вашего приложения
  output: {
    path: path.resolve(__dirname, 'dist'), // Путь к директории для сборки
    publicPath: '/', // Публичный URL-адрес для роутинга на стороне клиента
    filename: 'bundle.js' // Имя файла сборки
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Директория для статических файлов
    },
    port: 8080, // Порт для dev server
    historyApiFallback: true, // Для поддержки HTML5 History API
    open: true, // Открыть браузер после запуска сервера
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Путь к вашему шаблону index.html
      filename: 'index.html', // Имя файла, которое будет создано в dist
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // Добавьте другие правила если необходимо
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Расширения, которые будут обрабатываться
  },
};
