

// Импорт модуля http для создания HTTP-сервера
const http = require('http');

// Импорт вашего Koa-приложения из файла server.app
const app = require('./server.app');

// Создание HTTP-сервера с использованием вашего Koa-приложения
const server = http.createServer(app.callback());

// Указание порта, на котором будет слушать сервер
const port = 7000;

// Запуск HTTP-сервера и прослушивание указанного порта
server.listen(port, (err) => {
  if (err) {
    // В случае ошибки выводим сообщение в консоль
    console.log('ERROR: ', err);
    return;
  };

  // В случае успешного запуска сервера выводим сообщение о том, на каком порту он слушает
  console.log('Server is listening to ' + port);
});
