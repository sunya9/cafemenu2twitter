const Koa = require('koa')
const route = require('koa-route')
require('dotenv').config()

const Cafe = require('./lib/Cafe')
const Template = require('./lib/Template')

const app = new Koa()

async function fetch(ctx, id) {
  ctx.body = await new Cafe(2, id)
    .get()
    .then(cafe => new Template(cafe).getTemplate())
}

app.use(route.get('/:id', fetch))

app.listen(3000)
