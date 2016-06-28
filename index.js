const Cafe = require('./lib/Cafe')
const debug = require('debug')('cafemenu2twitter')

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

Promise.all([1, 2, 3, 4].map(n => new Cafe(times.afternoon, `0${n}`, n).get()))
  .catch(console.error)
  .then(getTemplates)
  .catch(console.error)
  .then(captureHtmls)
  .catch(console.error)
  .then(trimmingCaptures)
  .catch(console.error)
  .then(uploadScreenshots)
  .catch(console.error)
  .then(post2twitter)
  .catch(console.error)
