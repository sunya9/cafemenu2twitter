const Cafe = require('./lib/Cafe')
const debug = require('debug')('cafemenu2twitter')
const cron = require('node-cron')
require('dotenv').config()

const {
  getTemplates,
  captureHtmls,
  trimmingCaptures,
  uploadScreenshots,
  post2twitter
} = require('./lib/func')

const times = {
  morning: 1,
  afternoon: 2,
  dinner: 3
}
cron.schedule('0 11 * * 1-6', () => {
  Promise.all('1234'.split('').map(n => new Cafe(times.afternoon, n).get()))
    .then(getTemplates)
    .then(captureHtmls)
    .then(trimmingCaptures)
    .then(uploadScreenshots)
    .then(post2twitter)
    .catch(debug)
})
