const { getAST, getDependencies, transform } = require('./parser')
const path = require('path')

const ast = getAST(path.join(__dirname, '../src/index.js'))
// console.log('ast', ast)


const dependencies = getDependencies(ast)

// console.log('dependencies', dependencies)

const source = transform(ast)
console.log('source', source)
