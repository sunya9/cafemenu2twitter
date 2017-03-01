const debug = require('debug')('cafemenu2twitter')
const webshot = require('webshot')
const Twitter = require('twitter')
const MemoryStream = require('memorystream')
const gm = require('gm').subClass({ imageMagick: true })
const PngQuant = require('pngquant')
require('dotenv').config()
const Template = require('./Template')

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

exports.getTemplates = cafes => {
  return cafes
    .filter(menu => menu.meta.start !== '0000')
    .map(getTemplate)
}

const getTemplate = cafe => {
  return new Template(cafe).getTemplate()
}

exports.captureHtmls = htmls => {
  return Promise.all(htmls.map(captureHtmlPromise))
}

const captureHtmlPromise = html => {
  debug('captureHtmlPromise')
  return new Promise((resolve, reject) => {
    const screenshot = new MemoryStream(null, {
      readable: false
    })
    const option = {
      siteType: 'html',
      screenSize: {
        width: 1920,
        height: 3000
      }
    }
    screenshot.on('finish', () => {
      debug('captured')
      resolve(screenshot.toBuffer())
    })
    screenshot.on('error', reject)
    webshot(html, option).pipe(screenshot)
  })
}

exports.trimmingCaptures = captures => {
  return Promise.all(captures.map(trimmingCapture))
}

const trimmingCapture = capture => {
  return new Promise((resolve, reject) => {
    const trimmedScreenshot = new MemoryStream(null, {
      readable: false
    })
    gm(capture)
      .trim()
      .stream()
      .pipe(new PngQuant([256]))
      .pipe(trimmedScreenshot)
    trimmedScreenshot.on('finish', () => {
      debug('trimmed image size: %d', trimmedScreenshot.toBuffer().length)
      resolve(trimmedScreenshot.toBuffer())
    })
    trimmedScreenshot.on('error', reject)
  })
}

exports.uploadScreenshots = screenshots => {
  return Promise.all(screenshots.map(uploadScreenshot))
}

const uploadScreenshot = screenshot => {
  return new Promise((resolve, reject) => {
    client.post('media/upload', {
      media: screenshot
    }, (err, res) => {
      if (err) reject(err)
      debug('uploaded: %s', res.media_id_string)
      resolve(res.media_id_string)
    })
  })
}

exports.post2twitter = mediaIds => {
  debug('mediaIds: %s', mediaIds)
  const status = {
    media_ids: mediaIds.join(',')
  }
  client.post('statuses/update', status, (err, res) => {
    if (err) return console.error(err)
    debug(res.text)
  })
}
