/* eslint-disable unicorn/no-useless-undefined */
import fs from 'node:fs'
import path from 'node:path'
import ts, {CallExpression, Expression, ImportSpecifier, NamedImports, TypeNode, TypeReferenceNode} from 'typescript'
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

  getRenamedTypeWrapper(callExp: CallExpression): CallExpression {
    const expression = callExp.expression
    if (!ts.isIdentifier(expression) || !expression.text.startsWith('create'))
      return callExp

    this.changes.push(`Updating creation wrapper call ${expression.text} to use the App namespace`)

    switch (expression.text) {
    case 'createManga': {
      let mangaIdExpression: Expression | undefined
      if (callExp.arguments.length > 0 && ts.isObjectLiteralExpression(callExp.arguments[0])) {
        const exp = callExp.arguments[0].properties.find(x => x.name && ts.isIdentifier(x.name) && x.name.text === 'id')

        if (exp && ts.isPropertyAssignment(exp)) {
          mangaIdExpression = exp.initializer
        }

        if (exp && ts.isShorthandPropertyAssignment(exp)) {
          mangaIdExpression = exp.name
        }
      }

      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createSourceManga'),
        ),
        callExp.typeArguments,
        [ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('id'),
            mangaIdExpression ?? ts.factory.createIdentifier('undefined'),
          ),
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('mangaInfo'),
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('App'),
                ts.factory.createIdentifier('createMangaInfo'),
              ),
              callExp.typeArguments,
              callExp.arguments,
            ),
          ),
        ], true)],
      )
    }

    case 'createMangaTile':
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createPartialSourceManga'),
        ),
        callExp.typeArguments,
        callExp.arguments,
      )
    default: break
    }

    return ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier('App'),
        ts.factory.createIdentifier(expression.text),
      ),
      callExp.typeArguments,
      callExp.arguments,
    )
  }

  getRenamedImport(namedImport: ImportSpecifier): ImportSpecifier {
    switch (namedImport.name.text) {
    case 'Manga': return ts.factory.createImportSpecifier(
      false, undefined, ts.factory.createIdentifier('SourceManga'),
    )
    case 'TagType': return ts.factory.createImportSpecifier(
      false, undefined, ts.factory.createIdentifier('BadgeColor'),
    )
    case 'MangaTile': return ts.factory.createImportSpecifier(
      false, undefined, ts.factory.createIdentifier('PartialSourceManga'),
    )
    default:
      return namedImport
    }
  }

  getRenamedType(type: TypeReferenceNode): TypeReferenceNode {
    if (!ts.isIdentifier(type.typeName)) return type

    switch (type.typeName.text) {
    case 'Manga':
      return ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('SourceManga'),
        undefined,
      )
    case 'MangaTile':
      return ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('PartialSourceManga'),
        undefined,
      )
    }

    return type
  }

  transform() {
    return ts.transform(this.sourceFile, [this.transformerFactory.bind(this)])
  }

  transformerFactory(context: ts.TransformationContext) {
    const changes = this.changes

    return (rootNode: ts.Node) => {
      const visitNode = (node: ts.Node): ts.Node => {
        // Migrate the import declerations
        if (ts.isImportDeclaration(node)) {
          const moduleSpecifier = node.moduleSpecifier
          if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text.startsWith('paperback-extensions-common')) {
            changes.push('Import to @paperback/types')
            const namedImports = node.importClause?.namedBindings as NamedImports

            return ts.visitEachChild(
              ts.factory.createImportDeclaration(
                undefined,
                node.modifiers,
                ts.factory.createImportClause(
                  node.importClause?.isTypeOnly ?? false,
                  node.importClause?.name,
                  namedImports?.elements ? ts.factory.createNamedImports(
                    namedImports.elements.map(x => this.getRenamedImport(x)),
                  ) : node.importClause?.namedBindings,
                ),
                ts.factory.createStringLiteral('@paperback/types'),
                node.assertClause,
              ),
              visitNode.bind(this),
              context,
            )
          }
        }

        if (ts.isCallExpression(node)) {
          const expression = node.expression
          if (ts.isIdentifier(expression)) {
            return ts.visitEachChild(this.getRenamedTypeWrapper(node), visitNode.bind(this), context)
          }
        }

        if (ts.isTypeReferenceNode(node)) {
          return ts.visitEachChild(this.getRenamedType(node), visitNode.bind(this), context)
        }

        return ts.visitEachChild(node, visitNode.bind(this), context)
      }

      return ts.visitNode(rootNode, visitNode.bind(this))
    }
  }
}
