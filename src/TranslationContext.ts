import {
  GraphQLSchema,
  TypeInfo,
  GraphQLResolveInfo,
  GraphQLOutputType,
  GraphQLCompositeType,
  GraphQLInputType,
  GraphQLField,
  GraphQLDirective,
  GraphQLArgument,
  ASTNode,
} from 'graphql';
import Maybe from 'graphql/tsutils/Maybe';
import { AstNode, AstCoalescer } from './ast';

// Modeling after graphql-js ValidationContext
// Still a WIP to determine what might be helpful to
// access routinely in TranslationRules.

export class TranslationContext {
  protected _ast: ASTNode;
  protected _storeAstNode: (astNodes: { loc: string; node: AstCoalescer }) => void;
  protected _schema: GraphQLSchema;
  protected _typeInfo: TypeInfo;
  protected _reqCtx: any;
  protected _params: { [argName: string]: any };

  constructor(
    params: { [argName: string]: any }, // is this needed? or is it already in resolveInfo?
    reqCtx: any,
    resolveInfo: GraphQLResolveInfo,
    typeInfo: TypeInfo,
    storeAstNode: (astNode: { loc: string; node: AstCoalescer }) => void,
  ) {
    this._ast = resolveInfo.operation;
    this._reqCtx = reqCtx;
    this._schema = resolveInfo.schema;
    this._typeInfo = typeInfo;
    this._storeAstNode = storeAstNode;
    this._params = params;
  }

  // accessor and utility methods?
  postAstNode(astNode: { loc: string; node: AstCoalescer }): void {
    this._storeAstNode(astNode);
  }

  getType(): Maybe<GraphQLOutputType> {
    return this._typeInfo.getType();
  }

  getParentType(): Maybe<GraphQLCompositeType> {
    return this._typeInfo.getParentType();
  }

  getInputType(): Maybe<GraphQLInputType> {
    return this._typeInfo.getInputType();
  }

  getParentInputType(): Maybe<GraphQLInputType> {
    return this._typeInfo.getParentInputType();
  }

  getFieldDef(): Maybe<GraphQLField<any, any>> {
    return this._typeInfo.getFieldDef();
  }

  getDirective(): Maybe<GraphQLDirective> {
    return this._typeInfo.getDirective();
  }

  getArgument(): Maybe<GraphQLArgument> {
    return this._typeInfo.getArgument();
  }

  fromRequestContext(arg: string) {
    return this._reqCtx[arg];
  }
}
