const debug = require('debug')('cafemenu2twitter')
const puppeteer = require('puppeteer')
const Twitter = require('twitter')
const MemoryStream = require('memorystream')
const gm = require('gm').subClass({
  imageMagick: true
})
const PngQuant = require('pngquant')
require('dotenv').config()
const Template = require('./Template')

const {
  CONSUMER_KEY: consumer_key,
  CONSUMER_SECRET: consumer_secret,
  ACCESS_TOKEN_KEY: access_token_key,
  ACCESS_TOKEN_SECRET: access_token_secret
} = process.env

const client = new Twitter({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
})

exports.getTemplates = cafes => {
  return cafes
    .filter(menu => menu.meta.start !== '0000')
    .map(getTemplate)
}

const getTemplate = cafe => {
  return new Template(cafe).template
}

exports.captureHtmls = htmls => {
  console.log(htmls)
  return puppeteer.launch()
    .then(browser => htmls.map(captureHtmlPromise(browser)))
    .then(Promise.all.bind(Promise))
}

const captureHtmlPromise = browser => {
  debug('captureHtmlPromise')
  return async html => {
    const page = await browser.newPage()
    const loaded = page.waitForNavigation({
      waitUntil: 'load'
    })
    await page.setViewport({
      width: 1920,
      height: 1080
    })
    await page.setContent(html)
    await loaded
    const ssBuf = await page.screenshot()
    return ssBuf
  }
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

const uploadScreenshot = media => {
  return client.post('media/upload', {
    media
  })
    .then(res => {
      debug('uploaded: %s', res.media_id_string)
      return res.media_id_string
    })
}

exports.post2twitter = mediaIds => {
  debug('mediaIds: %s', mediaIds)
  const status = {
    media_ids: mediaIds.join(',')
  }
  return client.post('statuses/update', status)
    .then(res => debug(res.text))
    .catch(console.error)
}