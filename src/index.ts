import { GraphQLResolveInfo, visitInParallel, visitWithTypeInfo, TypeInfo, visit, ASTVisitor } from 'graphql';
import { TranslationContext } from './TranslationContext';
import { AstMap } from './ast';

export type TranslationRule = (ctx: TranslationContext) => ASTVisitor;

export function translate(
  params: { [argName: string]: any },
  ctx: any,
  resolveInfo: GraphQLResolveInfo,
  rules: TranslationRule[], // default to specifiedRules? what to include?
): AstMap {
  const abortObj = Object.freeze({});
  const queryMap: AstMap = {};
  const typeInfo = new TypeInfo(resolveInfo.schema);
  const documentAST = resolveInfo.operation;
  const context = new TranslationContext(params, ctx, resolveInfo, typeInfo, astMaps => {
    queryMap[astMaps.loc] = astMaps.node;
  });

  // This uses a specialized visitor which runs multiple visitors in parallel,
  // while maintaining the visitor skip and break API.
  const visitor = visitInParallel(rules.map(rule => rule(context)));

  // Visit the whole document with each instance of all provided rules.
  try {
    visit(documentAST, visitWithTypeInfo(typeInfo, visitor));
  } catch (e) {
    if (e !== abortObj) {
      throw e;
    }
  }
  return queryMap;
}
