const Koa = require('koa');
const router = require('./routes');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const json = require('koa-json')
const cors = require('koa2-cors');

const port = process.env.PORT || 8888;

const app = new Koa();

// logger middleware
app.use(logger());

// add bodyParser middleware
app.use(bodyparser());

// Json prettier
app.use(json());

// allow cors
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'POST'],
  headers: ['Content-Type', 'Authorization']
}));

// add router middleware:
app.use(router.routes(), router.allowedMethods());

// Listen on Port
app.listen(port);
