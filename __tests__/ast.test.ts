import { AstNode, AstMap } from "../src/ast";
import { coalesce } from "../src";

describe('ast nodes', () => {
    // Cypher AST nodes are provided for reference
    // and ../src/ast/index.ts only defines interfaces/types.
    // Unit tests using the Cypher AST definitions could
    // test type interactions between AstNode and AstNodeResolver
    // when calling build
    test('should resolve as expected', () => {
        let node: AstNode = {
            type: 'test',
            resolve(m: AstMap) { 
                return {
                    type: 'testreturn',
                    resolve(m: AstMap) {
                        return this;
                    }                    
                };
            }
        };
        let astmap: AstMap = {};
        let actualnode = node.resolve(astmap);
        let newnode = actualnode.resolve(astmap);
        expect(actualnode).not.toBeNull();
        expect(actualnode).toBeDefined();
        expect(actualnode.type).toBe('testreturn');
        expect(newnode).not.toBeNull();
        expect(newnode).toBeDefined();
        expect(newnode.type).toBe('testreturn');
        expect(newnode).toBe(actualnode);
    });
});

describe('default coalesce behavior', () => {
    test('it should throw error when AstMap argument does not contain root', () => {
        let node: AstNode = {
            type: 'test',
            resolve(m: AstMap) { 
                return this;
            }
        };
        let astmap: AstMap = {};
        astmap['not_root'] = node;
        expect(() => {
            coalesce(astmap)
        }).toThrowError();
    });
    test('It should resolve the AstNode at AstMap root', () => {
        let node: AstNode = {
            type: 'test',
            resolve(m: AstMap) { 
                return {
                    type: 'testreturn',
                    resolve(m: AstMap) {
                        return this;
                    }                    
                };
            }
        };
        let astmap: AstMap = {};
        astmap['root'] = node;
        let actualnode: AstNode = coalesce(astmap);
        let newnode: AstNode = actualnode.resolve(astmap);
        expect(actualnode).not.toBeNull();
        expect(actualnode).toBeDefined();
        expect(actualnode.type).toBe('testreturn');
        expect(newnode).not.toBeNull();
        expect(newnode).toBeDefined();
        expect(newnode.type).toBe('testreturn');
        expect(newnode).toBe(actualnode);
    });
})