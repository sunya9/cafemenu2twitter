const _ = require('lodash')
const moji = require('moji')

class Menu {
  constructor(menuArray) {
    const menuObj = _.zipObject(Menu.header, menuArray)
    this._info = _.zipObject(Menu.infoHeader, menuArray.slice(Menu.header.length, Menu.header.length + Menu.infoRows))
    if(menuObj.name1)
      menuObj.name1 += ' '
    this._name = moji(menuObj.name1 + menuObj.name2)
      .convert('ZE', 'HE')
      .convert('HK', 'ZK')
      .toString()
    this._imageUrl = menuObj.largeImageUrl
    this._plateful = menuObj.plateful
    this.getTemplate = this.getTemplate.bind(this)
  }
  getName() {
    return this._name
  }
  getImageUrl() {
    return this._imageUrl
  }
  getTemplate() {
    return _.template(Menu.template)({photo: this.getImageUrl(), name: this.getName(), price: this.getPrice()})
  }
  getPrice() {
    return this._info.value
  }
}

Menu.chunk = 13
Menu.infoRows = 3

Menu.header = [
  'id',
  'name1',
  'name2',
  'smallImageUrl',
  'largeImageUrl',
  'allergy',
  'plateful'
]

Menu.infoHeader = [
  'value',
  'cal',
  'code'
]

Menu.template = `
  <li>
    <div class="menu<%- !photo ? ' menu--no-thumb'  : '' %>">
      <img src="<%- photo %>" class="menu__photo" />
      <div class="menu__name"><%- name %> <%- price %></div>
    </div>
  </li>
`

module.exports = Menu
