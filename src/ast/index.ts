export interface AstNode {
  type: string;
}

export type AstNodeResolver<T extends AstNode> = (...args: any[]) => T;
export type ExpectedNode<T> = T extends AstNode ? T | AstNodeResolver<T> : never;

export interface AstMap {
  [loc: string]: AstNode;
}
