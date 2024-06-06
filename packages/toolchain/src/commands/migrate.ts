/* eslint-disable unicorn/no-useless-undefined */
import fs from 'node:fs'
import path from 'node:path'
import ts, {CallExpression, Expression, ImportSpecifier, NamedImports, ObjectLiteralExpression, PropertyAccessExpression, TypeReferenceNode} from 'typescript'
import {CLICommand} from '../command'
import shell from 'shelljs'

export default class Migrate extends CLICommand {
  static override description = 'Migrate 0.7 sources to 0.8'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<void> {
    this.log('Traversing /src directory')

    // eslint-disable-next-line unicorn/prefer-module
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
      const filePath = path.normalize(sourceFile.fileName)

      if (!tsFilesSet.has(filePath)) continue
      this.log('PROCESSING ' + filePath)

      const transformer = new FileTransformer(sourceFile)
      const transformedFiles = transformer.transform().transformed

      if (transformer.changes.length > 0) {
        this.log(' - ' + transformer.changes.join('\n - '))

        fs.writeFileSync(
          filePath,
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

  getPropertyAssignmentExpressions<T extends Record<string, Expression | undefined>>(node: ts.Node, obj: T): T {
    if (!ts.isObjectLiteralExpression(node)) return obj

    const keySet = new Set(Object.keys(obj))

    for (const prop of node.properties) {
      if (!prop.name || !ts.isIdentifier(prop.name) || !keySet.has(prop.name.text)) continue
      if (prop && ts.isPropertyAssignment(prop)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj[prop.name.text] = prop.initializer
      }

      if (prop && ts.isShorthandPropertyAssignment(prop)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj[prop.name.text] = prop.name
      }
    }

    return obj
  }

  getRenamedTypeWrapper(callExp: CallExpression): ts.Node | undefined {
    const expression = callExp.expression
    if (!ts.isIdentifier(expression) || !expression.text.startsWith('create'))
      return callExp

    this.changes.push(`Updating creation wrapper call ${expression.text} to use the App namespace`)

    switch (expression.text) {
    case 'createHomeSection': {
      const propAssignments = this.getPropertyAssignmentExpressions(
        callExp.arguments[0],
        {
          // eslint-disable-next-line camelcase
          view_more: undefined,
          type: undefined,
        },
      )

      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createHomeSection'),
        ),
        callExp.typeArguments,
        [ts.factory.createObjectLiteralExpression([
          ...(callExp.arguments[0] as ObjectLiteralExpression).properties.filter(x => {
            const removedProps = new Set(Object.keys(propAssignments))
            if (x.name && ts.isIdentifier(x.name) && removedProps.has(x.name.text)) return false
            return true
          }),

          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('containsMoreItems'),
            propAssignments.view_more ?? ts.factory.createIdentifier('false'),
          ),

          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('type'),
            propAssignments.type ?? ts.factory.createStringLiteral('singleRowNormal'),
          ),
        ], true)],
      )
    }

    case 'createChapterDetails':
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createChapterDetails'),
        ),
        callExp.typeArguments,
        [ts.factory.createObjectLiteralExpression([
          ...(callExp.arguments[0] as ObjectLiteralExpression).properties.filter(x => {
            const removedProps = new Set(['longStrip'])
            if (x.name && ts.isIdentifier(x.name) && removedProps.has(x.name.text)) return false
            return true
          }),
        ], true)],
      )

    case 'createChapter': {
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createChapter'),
        ),
        callExp.typeArguments,
        [ts.factory.createObjectLiteralExpression([
          ...(callExp.arguments[0] as ObjectLiteralExpression).properties.filter(x => {
            const removedProps = new Set(['mangaId'])
            if (x.name && ts.isIdentifier(x.name) && removedProps.has(x.name.text)) return false
            return true
          }),
        ], true)],
      )
    }

    case 'createIconText': {
      const propAssignments = this.getPropertyAssignmentExpressions(
        callExp.arguments[0],
        {text: undefined},
      )

      return propAssignments.text
    }

    case 'createManga': {
      const propAssignments = this.getPropertyAssignmentExpressions(
        callExp.arguments[0],
        {id: undefined},
      )

      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createSourceManga'),
        ),
        callExp.typeArguments,
        [ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('id'),
            propAssignments.id ?? ts.factory.createIdentifier('undefined'),
          ),
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('mangaInfo'),
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('App'),
                ts.factory.createIdentifier('createMangaInfo'),
              ),
              callExp.typeArguments,
              [ts.factory.createObjectLiteralExpression([
                ...(callExp.arguments[0] as ObjectLiteralExpression).properties.filter(x => {
                  const removedProps = new Set(Object.keys(propAssignments))
                  if (x.name && ts.isIdentifier(x.name) && removedProps.has(x.name.text)) return false
                  return true
                }),
              ], true)],
            ),
          ),
        ], true)],
      )
    }

    case 'createMangaTile': {
      const propAssignments = this.getPropertyAssignmentExpressions(
        callExp.arguments[0],
        {
          id: undefined,
          subtitleText: undefined,
          subtitle: undefined,
        },
      )

      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createPartialSourceManga'),
        ),
        callExp.typeArguments,
        [ts.factory.createObjectLiteralExpression([
          ...(callExp.arguments[0] as ObjectLiteralExpression).properties.filter(x => {
            const removedProps = new Set(Object.keys(propAssignments))
            if (x.name && ts.isIdentifier(x.name) && removedProps.has(x.name.text)) return false
            return true
          }),
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('mangaId'),
            propAssignments.id ?? ts.factory.createIdentifier('undefined'),
          ),
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('subtitle'),
            propAssignments.subtitle ??
             propAssignments.subtitleText ??
              ts.factory.createIdentifier('undefined'),
          ),
        ], true)],
      )
    }

    case 'createRequestObject':
      return ts.factory.createCallExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier('App'),
          ts.factory.createIdentifier('createRequest'),
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

  getRenamedPropertyAccessor(property: PropertyAccessExpression): ts.Node | undefined {
    const expression = property.expression
    if (!ts.isIdentifier(expression)) return property

    switch (expression.text) {
    case 'TagType':
      return ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier('BadgeColor'),
        property.name,
      )
    }

    return property
  }

  transform() {
    return ts.transform(this.sourceFile, [this.transformerFactory.bind(this)])
  }

  transformerFactory(context: ts.TransformationContext) {
    const changes = this.changes

    return (rootNode: ts.Node) => {
      const visitNode = (node: ts.Node): ts.Node | undefined => {
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

        if (ts.isPropertyAccessExpression(node)) {
          return ts.visitEachChild(this.getRenamedPropertyAccessor(node), visitNode.bind(this), context)
        }

        return ts.visitEachChild(node, visitNode.bind(this), context)
      }

      return ts.visitNode(rootNode, visitNode.bind(this))
    }
  }
}
