const fs = require('fs')
const path = require('path')
require('should')

const Cafe = require('../lib/Cafe')
const Menu = require('../lib/Menu')

describe('cafemenu2twitter', () => {
  const menu = fs.readFileSync(path.join(__dirname, 'fixtures/menu.txt'), 'utf-8')
  describe('afternoon', () => {
    describe('parse menu', () => {
      const cafe = new Cafe()
      const parsed = cafe._parse(menu)
      it('menusは配列', () => {
        parsed.menus.should.be.instanceof(Array)
      })
      it('menusの中身は全てMenuクラス', () => {
        parsed.menus.every(menu => menu instanceof Menu).should.be.true()
      })
    })
  })
})
