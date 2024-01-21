// Импорт необходимых модулей
const Koa = require('koa');
const { koaBody } = require('koa-body');
const uuid = require('uuid');
const cors = require('@koa/cors');

// Создание экземпляра Koa-приложения
const app = new Koa();

// Массив для хранения тикетов
const tickets = [];

// Класс для представления тикета
class Ticket {
  constructor(id, name, description, status, created) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }

  // Геттер для короткого представления тикета
  get ticketShort() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      created: this.created
    }
  }

  // Геттер для полного представления тикета
  get ticketFull() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      created: this.created
    }
  }
}

// Создание нескольких тестовых тикетов и добавление их в массив
const firstTicket = new Ticket(uuid.v4(), 'Short description 1', 'description 1', false, new Date());
const secondTicket = new Ticket(uuid.v4(), 'Short description 2', 'description 2', false, new Date());
tickets.push(firstTicket);
tickets.push(secondTicket);

// Использование middleware для обработки различных типов запросов
app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

// Включение поддержки CORS для обработки запросов из разных источников
app.use(cors());

// Основной обработчик запросов
app.use(async (ctx) => {

  // Извлечение метода запроса из параметра query
  const { method } = ctx.query;
  // Извлечение данных из тела запроса
  const { name, description, status } = ctx.request.body;

  console.log(method);//главный дебуггер

  // Обработка различных методов
  switch (method) {
    case 'allTickets':
      // Возвращение всех тикетов
      ctx.response.body = tickets;
      return;

    case 'ticketById':

      // Возвращение тикета по идентификатору
      if (ctx.query.id) {
        const ticket = tickets.find((item) => item.id === ctx.query.id);
        // console.log(ticket)
        if (ticket) {
          ctx.response.body = ticket.ticketFull;
        } else {
          ctx.response.status = 404;
        }
      }
      return;

    case 'createTicket':
      // Создание нового тикета и добавление его в массив
      const id = uuid.v4();
      const created = new Date();
      const newTicket = new Ticket(id, name, description, false, created)
      tickets.push(newTicket);
      ctx.response.body = newTicket;
      return;

    case 'removeById':
      // Удаление тикета по идентификатору
      const index = tickets.findIndex((item) => item.id === ctx.query.id);
      tickets.splice(index, 1);
      ctx.response.body = true;
      return;

    case 'updateById':
      // Обновление данных тикета по идентификатору
      const idx = tickets.findIndex((item) => item.id === ctx.query.id);

      if (idx < 0) return;

      tickets[idx].name = name ? name : tickets[idx].name;
      tickets[idx].status = status ? status : false;
      tickets[idx].description = description ? description : tickets[idx].description;
      ctx.response.body = tickets[idx];
      return;

    default:
      // Если метод не распознан, возвращаем 404
      ctx.response.status = 404;
      console.log('error')
      return;
  }
});

// Экспорт Koa-приложения для использования в других файлах
module.exports = app;
