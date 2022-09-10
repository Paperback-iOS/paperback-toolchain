import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import {CLICommand} from '../command'
import shell from 'shelljs'

export default class Migrate extends CLICommand {
  static override description = 'Migrate 0.7 sources to 0.8'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('Traversing /src directory')

    const myPkgPath = path.join(__dirname, '../../package.json')
    const myPkg = JSON.parse(fs.readFileSync(myPkgPath).toString())

    const cwd = process.cwd()
    const srcDir = path.join(cwd, 'src')
    const packagePath = path.join(cwd, 'package.json')
    if (!fs.existsSync(packagePath)) {
      throw new Error('could not locate package.json')
    }

    if (!fs.lstatSync(srcDir).isDirectory()) {
      throw new Error('/src is not a directory')
    }

    const tsFiles: string[] = []
    this.goThrough(srcDir, tsFiles)
    this.migrateTypescriptFiles(tsFiles)

    const pkg = JSON.parse(fs.readFileSync(packagePath).toString())
    delete pkg.dependencies['paperback-extensions-common']
    delete pkg.dependencies['paperback-cli']

    this.log(`setting @paperback/types and @paperback/toolchain to ${myPkg.version}`)
    pkg.dependencies['@paperback/types'] = myPkg.version
    pkg.dependencies['@paperback/toolchain'] = myPkg.version
    fs.writeFileSync(packagePath, JSON.stringify(pkg, undefined, 2))

    shell.exec('npm i')
  }

  goThrough(dir: string, tsFiles: string[]) {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file)
      if (fs.lstatSync(filePath).isDirectory()) {
        this.goThrough(filePath, tsFiles)
        continue
      }

      if (!file.endsWith('.ts')) {
        continue
      }

      tsFiles.push(filePath)
    }
  }

  migrateTypescriptFiles(tsFiles: string[]) {
    const prog = ts.createProgram(tsFiles, {})
    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed, omitTrailingSemicolon: true})

    const tsFilesSet = new Set(tsFiles)
    for (const sourceFile of prog.getSourceFiles()) {
      if (!tsFilesSet.has(sourceFile.fileName)) continue
      this.log('PROCESSING ' + sourceFile.fileName)

      const transformer = new FileTransformer(sourceFile)
      const transformedFiles = transformer.transform().transformed

      if (transformer.changes.length > 0) {
        this.log(' - ' + transformer.changes.join('\n - '))

        fs.writeFileSync(
          sourceFile.fileName,
          printer.printList(
            ts.ListFormat.MultiLine,
            ts.factory.createNodeArray(transformedFiles),
            sourceFile,
          ),
        )
      }
    }
  }
}

class FileTransformer {
  changes: string[]

  constructor(public sourceFile: ts.SourceFile) {
    this.changes = []
  }

  transform() {
    return ts.transform(this.sourceFile, [this.transformerFactory.bind(this)])
  }

  transformerFactory(context: ts.TransformationContext) {
    const changes = this.changes

    return (rootNode: ts.Node) => {
      const visitNode = (node: ts.Node): ts.Node => {
        if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier
          if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text.startsWith('paperback-extensions-common')) {
            changes.push('Import to @paperback/types')
            return ts.factory.createImportDeclaration(
              undefined,
              node.modifiers,
              node.importClause,
              ts.factory.createStringLiteral('@paperback/types'),
              node.assertClause,
            )
          }
        }

        if (ts.isCallExpression(node)) {
          const expression = node.expression
          if (ts.isIdentifier(expression) && expression.text.startsWith('create')) {
            changes.push(`Updating creation wrapper call ${expression.text} to use the App namespace`)
            return ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('App'),
                ts.factory.createIdentifier(expression.text),
              ),
              node.typeArguments,
              node.arguments,
            )
          }
        }

        return ts.visitEachChild(node, visitNode.bind(this), context)
      }

      return ts.visitNode(rootNode, visitNode.bind(this))
    }
  }
}
