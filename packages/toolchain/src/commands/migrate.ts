import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import {Command} from '@oclif/core'

export default class Migrate extends Command {
  static override description = 'Migrate 0.7 sources to 0.8'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('Traversing /src directory')

    const cwd = process.cwd()
    const srcDir = path.join(cwd, 'src')

    if (!fs.lstatSync(srcDir).isDirectory()) {
      throw new Error('/src is not a directory')
    }

    const tsFiles: string[] = []
    this.goThrough(srcDir, tsFiles)
    this.migrateTypescriptFiles(tsFiles)
  }

  goThrough(dir: string, tsFiles: string[]) {
    for (const file of fs.readdirSync(dir)) {
      if (fs.lstatSync(file).isDirectory()) {
        this.goThrough(file, tsFiles)
        return
      }

      if (!file.endsWith('.ts')) {
        continue
      }

      tsFiles.push(file)
    }
  }

  migrateTypescriptFiles(tsFiles: string[]) {
    const prog = ts.createProgram(tsFiles, {})
    const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed})

    for (const sourceFile of prog.getSourceFiles()) {
      const transformer = new FileTransformer(sourceFile)
      transformer.transform()
      this.log(transformer.changes.join('\n'))
      this.log(printer.printNode(ts.EmitHint.Unspecified, sourceFile, sourceFile))
    }
  }
}

class FileTransformer {
  changes: string[]

  constructor(public sourceFile: ts.SourceFile) {
    this.changes = []
  }

  transform() {
    return ts.transform(this.sourceFile, [this.transformerFactory])
  }

  transformerFactory(context: ts.TransformationContext) {
    return (rootNode: ts.Node) => {
      return ts.visitNode(rootNode, (node: ts.Node) => this.visitNode(node, context))
    }
  }

  visitNode(node: ts.Node, context: ts.TransformationContext): ts.Node {
    if (ts.isImportDeclaration(node) && node.importClause && node.moduleSpecifier.getText().startsWith('paperback-extensions-common')) {
      this.changes.push('Import to @paperback/types')
      return ts.factory.createImportDeclaration(
        undefined,
        node.modifiers,
        node.importClause,
        ts.factory.createIdentifier('@paperback/types'),
        node.assertClause,
      )
    }

    if (ts.isCallExpression(node) && node.expression.getText()?.startsWith('create')) {
      this.changes.push(`Updating creation wrapper call ${node.expression.getText()} to use the App namespace`)
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier(node.expression.getText()),
        ),
        node.typeArguments,
        node.arguments,
      )
    }

    return ts.visitEachChild(node, (node: ts.Node) => this.visitNode(node, context), context)
  }
}
