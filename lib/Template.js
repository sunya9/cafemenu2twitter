const _ = require('lodash')

class Template {
  constructor (cafe) {
    this._cafe = cafe
  }

  getTemplate () {
    const html = this._cafe.template
    return _.template(Template.template)({html}).trim()
  }
}

Template.template = `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>メニュー</title>
    <style>
    body {
      margin: 0;
      background-color: #fff;
    }
    ul {
      margin: 0;
      padding: 0;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      -ms-flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;
      -webkit-box-align: end;
      -webkit-align-items: flex-end;
      align-items: flex-end;
    }
    ul > li {
      flex-basis: 20%;
      width: 20%;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
    img {
      overflow: hidden;
      max-width: 100%;
    }
    .menu {
      position: relative;
      margin-bottom: -2px;
    }
    .menu__name {
      position: absolute;
      left: 0;
      width: calc(100% - 1rem);
      bottom: 0;
      padding: .7rem .5rem;
      background-color: rgba(0, 0, 0, .5);
      border-top: 1px solid #000;
      color: #fff;
      font-size: 1.7rem;
    }
    .menu--no-thumb .menu__name {
      position: static;
    }
    </style>
  </head>
  <body>
    <%= html %>
  </body>
</html>
`

module.exports = Template
