const Compiler = require('./compiler')
const Parser = require('./parser')
const options = require('./../simplepack.config')

new Compiler(options).run()