export interface AstNode {
  type: string;
  resolve: (this: AstNode, m: AstMap) => AstNode;
}

export interface AstNodeResolver<T extends AstNode> {
  type: string;
  resolve: (m: AstMap) => T;
}
export type ExpectedNode<T> = T extends AstNode ? T | AstNodeResolver<T> : never;
export type AstNodeResolverFn<T> = (this: T, m: AstMap) => AstNode;

export interface AstMap {
  [loc: string]: AstNode;
}
