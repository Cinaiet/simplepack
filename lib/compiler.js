const { getAST, getDependencies, transform } = require('./parser')
const path = require('path')
const fs = require('fs')

module.exports = class Compiler {
  constructor(props) {
    const { entry, output } = props
    this.entry = entry
    this.output = output
    this.modules = []
  }

  // 入口方法
  run() {
    const entryModule = this.buildModule(this.entry, true)
    this.modules.push(entryModule)

    this.modules.map((item) => {
      item.dependencies.map(sub => {
        this.modules.push(this.buildModule(sub))
      })
    })
    // console.log(this.modules)

    
    this.emitFile()
  }

  // 模块构建
  buildModule(filename, isEntry) {
    let ast 
    if(isEntry) {
      ast = getAST(filename)
    } else {
      const absolutePath = path.join(process.cwd(), './src', filename)
      ast = getAST(absolutePath)
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)

    }

  }

  // 输出文件
  emitFile() {

    let modules = ''
    this.modules.map(item => {
      modules += `'${item.filename}': function(require, module, exports) {${item.source}},`
    })

    const bundle = `(function(modules) {
      function require(filename) {
        var fn = modules[filename]
        
        var module = { exports: {}}

        fn(require, module, module.exports)

        return module.exports
      }

      require('${this.entry}')


    })({${modules}})`

    let outputPath = path.join(this.output.path, this.output.filename)

    console.log(bundle)
    fs.writeFileSync(outputPath, bundle, 'utf-8')

  }
}