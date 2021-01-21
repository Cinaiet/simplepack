const { default: traverse } = require('babel-traverse')
const babylon = require('babylon')
const fs = require('fs')
const babel = require('babel-core')
const { transformFromAst } = require('babel-core')
module.exports = {

  // 转换为AST
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8')

    return babylon.parse(source, {
      sourceType: 'module'
    })
  },
  //分析依赖
  getDependencies: (ast) => {
    const dependencies = []

    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value)
      }
    })

    return dependencies
  },
  // AST转换为ES5
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    })
    return code
  }

}