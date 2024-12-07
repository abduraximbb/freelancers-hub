const path = require('path');

const createViewpath = (page) => path.resolve(__dirname, "../views", `${page}.hbs`)

module.exports = {
    createViewpath,
}