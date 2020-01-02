import { AstNode, ExpectedNode } from '..';

// Interfaces adapted from node-cypher-parser (github.com/Loupi/node-cypher-parser)
// Credit and thanks to Louis-Pierre Beaumont (node-cypher-parser), Chris Leishman
// (author of libcypehr-parser upon which node-cypher-parser is based), and any
// other contributors to those two projects.

// TODO:
// - Verify/document that CypherOptionParams nested within Statement.options
//   works for current CypherParams (i.e. variable values passed with query).
// - Document that "WHERE" clauses are implicitly created through "predicate"
//   attribute of applicable Clause, and how UnaryOperator and BinaryOperator
//   handle AND, OR, NOT, etc. within predicate clauses.

export interface Parameter extends AstNode {
  name: string;
}

export interface Predicate extends AstNode {} // All references to Predicate removed

export interface Match extends AstNode {
  optional: boolean;
  pattern: ExpectedNode<Pattern>;
  hints: ExpectedNode<MatchHint[]>;
  predicate: ExpectedNode<Expression>; // Originally Predicate
}

export interface Query extends AstNode {
  clauses: ExpectedNode<Clause[]>;
  options: ExpectedNode<QueryOption[]>;
}

export interface Statement extends AstNode {
  body: ExpectedNode<Query | SchemaCommand>;
  options: ExpectedNode<StatementOption[]>;
}

export interface StatementOption extends AstNode {}

export interface CypherOption extends StatementOption {
  version: ExpectedNode<String>;
  params: ExpectedNode<CypherOptionParam[]>;
}

export interface CypherOptionParam extends AstNode {
  name: ExpectedNode<String>;
  value: ExpectedNode<String>;
}

export interface ExplainOption extends StatementOption {}
export interface ProfileOption extends StatementOption {}

export interface SchemaCommand extends AstNode {}

export interface CreateNodePropIndex extends SchemaCommand {
  label: ExpectedNode<Label>;
  propName: ExpectedNode<PropName>;
}

export interface DropNodePropIndex extends SchemaCommand {
  label: ExpectedNode<Label>;
  propName: ExpectedNode<PropName>;
}

export interface CreateNodePropConstraint extends SchemaCommand {
  identifier: ExpectedNode<Identifier>;
  label: ExpectedNode<Label>;
  expression: ExpectedNode<Expression>;
  unique: boolean;
}

export interface DropNodePropConstraint extends SchemaCommand {
  identifier: ExpectedNode<Identifier>;
  label: ExpectedNode<Label>;
  expression: ExpectedNode<Expression>;
  unique: boolean;
}

export interface CreateRelPropConstraint extends SchemaCommand {
  identifier: ExpectedNode<Identifier>;
  relType: ExpectedNode<RelType>;
  expression: ExpectedNode<Expression>;
  unique: boolean;
}

export interface DropRelPropConstraint extends SchemaCommand {
  identifier: ExpectedNode<Identifier>;
  relType: ExpectedNode<RelType>;
  expression: ExpectedNode<Expression>;
  unique: boolean;
}

export interface QueryOption extends AstNode {}

export interface UsingPeriodicCommit extends QueryOption {
  limit: number;
}

export interface QueryClause extends AstNode {}

export interface LoadCsv extends QueryClause {
  withHeaders: boolean;
  url: ExpectedNode<Expression>;
  identifier: ExpectedNode<Identifier>;
  fieldTerminator: ExpectedNode<String>;
}

export interface Start extends QueryClause {
  points: ExpectedNode<QueryOption[]>;
  predicate: ExpectedNode<Expression>; // Originally Predicate
}

export interface StartPoint extends AstNode {}

export interface NodeIndexLookup extends StartPoint {
  identifier: ExpectedNode<Identifier>;
  indexName: ExpectedNode<IndexName>;
  propName: ExpectedNode<PropName>;
  lookup: ExpectedNode<String | Parameter>;
}

export interface NodeIndexQuery extends StartPoint {
  identifier: ExpectedNode<Identifier>;
  indexName: ExpectedNode<IndexName>;
  query: ExpectedNode<String | Parameter>;
}

export interface NodeIdLookup extends StartPoint {
  identifier: ExpectedNode<Identifier>;
  ids: ExpectedNode<Integer[]>;
}

export interface AllNodesScan extends StartPoint {
  identifier: ExpectedNode<Identifier>;
}

export interface RelIndexQuery extends StartPoint {
  identifier: ExpectedNode<Identifier>;
  indexName: ExpectedNode<IndexName>;
  query: ExpectedNode<String | Parameter>;
}

export interface RelIdLookup extends StartPoint {
  identifier: ExpectedNode<Identifier>;
  ids: ExpectedNode<Integer[]>;
}

export interface AllRelsScan extends StartPoint {
  identifier: ExpectedNode<Identifier>;
}

export interface MatchHint extends AstNode {}

export interface UsingIndex extends MatchHint {
  identifier: ExpectedNode<Identifier>;
  label: ExpectedNode<Label>;
  propName: ExpectedNode<PropName>;
}

export interface UsingJoin extends MatchHint {
  identifier: ExpectedNode<Identifier>;
}

export interface UsingScan extends MatchHint {
  identifier: ExpectedNode<Identifier>;
  label: ExpectedNode<Label>;
}

export interface Clause extends AstNode {}

export interface Merge extends Clause {
  path: ExpectedNode<PatternPath>;
  actions: ExpectedNode<MergeHint[]>;
}

export interface MergeHint extends AstNode {}

export interface OnMatch extends MergeHint {
  items: ExpectedNode<SetItem[]>;
}

export interface OnCreate extends MergeHint {
  items: ExpectedNode<SetItem[]>;
}

export interface Create extends Clause {
  unique: boolean;
  pattern: ExpectedNode<PatternPath>;
}

export interface Set extends Clause {
  items: ExpectedNode<SetItem[]>;
}

export interface SetItem extends AstNode {}

export interface SetProperty extends SetItem {
  property: ExpectedNode<PropertyOperator>;
  expression: ExpectedNode<Expression>;
}

export interface SetAllProperties extends SetItem {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
}

export interface MergeProperties extends SetItem {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
}

export interface SetLabels extends SetItem {
  identifier: ExpectedNode<Identifier>;
  labels: ExpectedNode<Label[]>;
}

export interface Delete extends Clause {
  detach: true;
  expressions: ExpectedNode<Expression[]>;
}

export interface Remove extends Clause {
  items: ExpectedNode<Expression[]>;
}

export interface RemoveItem extends AstNode {}

export interface RemoveLabels extends RemoveItem {
  identifier: ExpectedNode<Identifier>;
  labels: ExpectedNode<Label>;
}

export interface RemoveProperty extends RemoveItem {
  property: ExpectedNode<PropertyOperator>;
}

export interface ForEach extends Clause {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  clauses: ExpectedNode<Clause[]>;
}

export interface With extends Clause {
  distinct: boolean;
  includeExisting: boolean;
  projections: ExpectedNode<Projection[]>;
  orderBy: ExpectedNode<OrderBy>;
  skip: ExpectedNode<Integer>;
  limit: ExpectedNode<Integer>;
  predicate: ExpectedNode<Expression>;
}

export interface Unwind extends Clause {
  expression: ExpectedNode<Expression>;
  alias: ExpectedNode<Expression>;
}

export interface Call extends Clause {
  procName: ExpectedNode<ProcName>;
  args: ExpectedNode<Expression[]>;
  projections: ExpectedNode<Projection[]>;
}

export interface Return extends Clause {
  distinct: boolean;
  includeExisting: boolean;
  projections: ExpectedNode<Projection[]>;
  orderBy: ExpectedNode<OrderBy>;
  skip: ExpectedNode<Integer>;
  limit: ExpectedNode<Integer>;
}

export interface Projection extends AstNode {
  expression: ExpectedNode<Expression>;
  alias: ExpectedNode<Identifier>;
}

export interface OrderBy extends AstNode {
  items: ExpectedNode<SortItem[]>;
}

export interface SortItem extends AstNode {
  expression: ExpectedNode<Expression>;
  ascending: boolean;
}

export interface Union extends Clause {
  all: boolean;
}

export interface Expression extends AstNode {}

export interface UnaryOperator extends Expression {
  op: string;
  arg: ExpectedNode<Expression>;
}

export interface BinaryOperator extends Expression {
  op: string;
  arg1: ExpectedNode<Expression>;
  arg2: ExpectedNode<Expression>;
}

export interface Comparison extends Expression {
  length: number;
  ops: string[];
  args: ExpectedNode<Expression[]>;
}

export interface ApplyOperator extends Expression {
  funcName: ExpectedNode<FunctionName>;
  distinct: boolean;
  args: ExpectedNode<Expression[]>;
}

export interface ApplyAllOperator extends Expression {
  funcName: ExpectedNode<FunctionName>;
  distinct: boolean;
}

export interface PropertyOperator extends Expression {
  expression: ExpectedNode<Expression>;
  propName: ExpectedNode<PropName>;
}

export interface SubscriptOperator extends Expression {
  expression: ExpectedNode<Expression>;
  subscript: ExpectedNode<Expression>;
}

export interface SliceOperator extends Expression {
  expression: ExpectedNode<Expression>;
  start: ExpectedNode<Expression>;
  end: ExpectedNode<Expression>;
}

export interface MapProjection extends Expression {
  expression: ExpectedNode<Expression>;
  selectors: ExpectedNode<MapProjectionSelector[]>;
}

export interface MapProjectionSelector extends AstNode {}

export interface MapProjectionLiteral extends MapProjectionSelector {
  propName: ExpectedNode<PropName>;
  expression: ExpectedNode<Expression>;
}

export interface MapProjectionProperty extends MapProjectionSelector {
  propName: ExpectedNode<PropName>;
}

export interface MapProjectionIdentifier extends MapProjectionSelector {
  identifier: ExpectedNode<Identifier>;
}

export interface MapProjectionAllProperties extends MapProjectionSelector {}

export interface ListComprehension extends Expression {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  predicate: ExpectedNode<Expression>;
  eval: ExpectedNode<Expression>;
}

export interface PatternComprehension extends Expression {
  identifier: ExpectedNode<Identifier>;
  pattern: ExpectedNode<PatternPath>;
  predicate: ExpectedNode<Expression>;
  eval: ExpectedNode<Expression>;
}

export interface Alternative {
  predicate: ExpectedNode<Expression>;
  value: ExpectedNode<Expression>;
}

export interface Case extends Expression {
  expression: ExpectedNode<Expression>;
  alternatives: ExpectedNode<Alternative[]>;
  default: ExpectedNode<Expression>;
}

export interface Filter extends ListComprehension {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  predicate: ExpectedNode<Expression>;
}

export interface Extract extends ListComprehension {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  eval: ExpectedNode<Expression>;
}

export interface Reduce extends Expression {
  accumulator: ExpectedNode<Identifier>;
  init: ExpectedNode<Expression>;
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  eval: ExpectedNode<Expression>;
}

export interface All extends ListComprehension {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  predicate: ExpectedNode<Expression>;
}

export interface Any extends ListComprehension {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  predicate: ExpectedNode<Expression>;
}

export interface Single extends ListComprehension {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  predicate: ExpectedNode<Expression>;
}

export interface None extends ListComprehension {
  identifier: ExpectedNode<Identifier>;
  expression: ExpectedNode<Expression>;
  predicate: ExpectedNode<Expression>;
}

export interface Collection extends Expression {
  elements: AstNode;
}

export interface Map extends Expression {
  entries: { [name: string]: AstNode };
}

export interface Identifier extends Expression {
  name: string;
}

export interface String extends Expression {
  value: string;
}

export interface Integer extends Expression {
  value: number;
}

export interface Float extends Expression {
  value: number;
}

export interface Boolean extends Expression {}
export interface True extends Boolean {}
export interface False extends Boolean {}
export interface Null extends Expression {}

export interface Label extends AstNode {
  name: string;
}

export interface RelType extends AstNode {
  name: string;
}

export interface PropName extends AstNode {
  value: string;
}

export interface FunctionName extends AstNode {
  value: string;
}

export interface IndexName extends AstNode {
  value: string;
}

export interface ProcName extends AstNode {
  value: string;
}

export interface Pattern extends AstNode {
  paths: ExpectedNode<PatternPath[]>;
}

export type patternPathElement = NodePattern | RelPattern;

export interface PatternPath extends AstNode {
  elements: ExpectedNode<patternPathElement[]>;
}

export interface NamedPath extends PatternPath {
  identifier: ExpectedNode<Identifier>;
  path: ExpectedNode<PatternPath>;
}

export interface ShortestPath extends PatternPath {
  single: boolean;
  path: ExpectedNode<PatternPath>;
}

export interface NodePattern extends AstNode {
  identifier: ExpectedNode<Identifier>;
  labels: ExpectedNode<Label>;
  properties: ExpectedNode<Map | Parameter>;
}

export interface RelPattern extends AstNode {
  direction: number;
  identifier: ExpectedNode<Identifier>;
  relTypes: ExpectedNode<Label>;
  properties: ExpectedNode<Map | Parameter>;
  varLength: ExpectedNode<Range>;
}

export interface Range extends AstNode {
  start: number;
  end: number;
}

export interface Command extends AstNode {
  name: string;
  args: ExpectedNode<String>;
}

export interface Comment extends AstNode {
  value: string;
}

export interface LineComment extends Comment {}

export interface BlockComment extends Comment {}

export interface Error extends AstNode {
  value: string;
}
