const fetch = require('node-fetch')
const qs = require('querystring')
const _ = require('lodash')
const { endpoint } = require('../config/endpoint')
const Menu = require('./Menu')

class Cafe {
  constructor (time, n) {
    this._time = time
    this._id = '0' + n
    this._n = n
    this._getTemplate = this._getTemplate.bind(this)
    this._parse = this._parse.bind(this)
  }
  get () {
    const option = qs.stringify({
      mode: 'cafe_menuget',
      kubun: this._time,
      cafeid: this._id,
      id: 0,
    })
    const url = `${endpoint}?${option}`
    return fetch(url)
      .then(res => res.text())
      .then(this._parse)
    .catch(console.error)
  }

  _getTemplate (option) {
    return _.template(Cafe.template)(option)
  }

  _parse (body) {
    body = body.split('\r\n')
    const menu = body.slice(Cafe.header.length)
    const res = {
      meta: _.zipObject(Cafe.header, body)
    }
    res.menus = _.chunk(menu, Menu.chunk)
      .filter(chunk => chunk.length === Menu.chunk)
      .map(menu => new Menu(menu))
    res.template = this._getTemplate({
      n: this._n,
      menusHTML: res.menus.map(menu => menu.getTemplate())
    })
    return res
  }
}

Cafe.template = `
  <h1>第<%= n %>食堂</h1>
  <ul id="menus">
    <%= menusHTML.join('') %>
  </ul>
`

Cafe.header = [
  'status',
  'date',
  'start',
  'end',
  'param1',
  'param2'
]

module.exports = Cafe
