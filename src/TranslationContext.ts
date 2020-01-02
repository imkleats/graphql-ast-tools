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
import { AstNode } from './ast';

// Modeling after graphql-js ValidationContext
// Still a WIP

export class TranslationContext {
  private _ast: ASTNode;
  private _storeAstNode: (astNodes: { loc: string; node: AstNode }) => void;
  private _schema: GraphQLSchema;
  private _typeInfo: TypeInfo;
  private _reqCtx: any;

  constructor(
    params: { [argName: string]: any },
    reqCtx: any,
    resolveInfo: GraphQLResolveInfo,
    typeInfo: TypeInfo,
    storeAstNode: (astNode: { loc: string; node: AstNode }) => void,
  ) {
    this._ast = resolveInfo.operation;
    this._reqCtx = reqCtx;
    this._schema = resolveInfo.schema;
    this._typeInfo = typeInfo;
    this._storeAstNode = storeAstNode;
  }

  // accessor and utility methods?
  postAstNode(astNode: { loc: string; node: AstNode }): void {
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
