const fetch = require('node-fetch')
const qs = require('querystring')
const _ = require('lodash')
const { endpoint } = require('../config/endpoint')
const Menu = require('./Menu')

class Cafe {
  constructor(time, id, n) {
    this._time = time
    this._id = id
    this._n = n
    this._getTemplate = this._getTemplate.bind(this)
  }
  get() {
    const option = qs.stringify({
      mode: 'cafe_menuget',
      kubun: this._time,
      cafeid: this._id,
      id: 0,
    })
    const url = `${endpoint}?${option}`
    return fetch(url)
      .then(res => res.text())
      .then(body => {
        body = body.split('\r\n')
        const menu = body.slice(Cafe.header.length)
        const res = {
          meta: _.zipObject(Cafe.header, body)
        }
        res.menus = _.chunk(menu, Menu.chunk)
        .filter(chunk => chunk.length == Menu.chunk)
        .map(menu => new Menu(menu))
        res.template = this._getTemplate({
          n: this._n,
          menusHTML: res.menus.map(menu => menu.getTemplate())
        })
      return res
    })
    .catch(console.error)
  }
  _getTemplate(option) {
    return _.template(Cafe.template)(option)
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
