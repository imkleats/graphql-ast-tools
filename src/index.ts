import { GraphQLResolveInfo, visitInParallel, visitWithTypeInfo, TypeInfo, visit, ASTVisitor } from 'graphql';
import { TranslationContext } from './TranslationContext';
import { AstMap, AstNode, ExpectedNode } from './ast';

export type TranslationRule = (ctx: TranslationContext) => ASTVisitor;
export type AstCoalescer = (astMap: AstMap) => ExpectedNode<AstNode>;

export function translate(
  params: { [argName: string]: any },
  ctx: any,
  resolveInfo: GraphQLResolveInfo,
  rules: TranslationRule[], // default to specifiedRules? what to include?
  coalescer: AstCoalescer = coalesce,
  // merge: (oldNode: AstNode, newNode: AstNode) => AstNode,
): AstNode {
  const abortObj = Object.freeze({});
  const queryMap: AstMap = {};
  const typeInfo = new TypeInfo(resolveInfo.schema);
  const documentAST = resolveInfo.operation;
  const context = new TranslationContext(params, ctx, resolveInfo, typeInfo, astMap => {
    //TODO: Implement conflict/merge resolution
    queryMap[astMap.loc] = astMap.node; // merge(queryMap[astMap.loc], astMap.node);
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
  const translatedAst = coalescer(queryMap);
  return translatedAst as AstNode;
}

export const coalesce: AstCoalescer = astMap => {
  // In an applicable TranslationRule, the user must
  // specify a 'root' node in the AstMap that recursively
  // populates all ExpectedNodes when resolved. Doing so as
  // a rule applied to OperationDefinition makes some sense.
  let coalescedQuery: AstNode;

  try {
    coalescedQuery = astMap['root'].resolve(astMap);
  } catch (e) {
    throw e;
  }

  return coalescedQuery;
};
