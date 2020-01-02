// Example script to grok the visitation context
// and the GraphQL Document AST when developing
// AST translation rules.

const { parse, visit } = require('graphql');

const query = `
{
    Movie(filter: { title_contains: "River Runs" }) {
        name
        #release {
            #date
        #}
    }
}
`;

const visitor = {
    enter(node, key, parent, path, ancestors) {
        console.log('Entering node:')
        console.log('---------------- Node ----------------')
        console.log(node);
        console.log('---------------- Key ----------------')
        console.log(key);
        console.log('---------------- Parent ----------------')
        console.log(parent);
        console.log('---------------- Path ----------------')
        console.log(path);
        console.log('---------------- Ancestors ----------------')
        console.log(ancestors)
        console.log('--------------------------------------')
    },
    leave(node, key, parent, path, ancestors) {
        console.log('Leaving node:')
        console.log('---------------- Node ----------------')
        console.log(node);
        console.log('---------------- Key ----------------')
        console.log(key);
        console.log('---------------- Parent ----------------')
        console.log(parent);
        console.log('---------------- Path ----------------')
        console.log(path);
        console.log('---------------- Ancestors ----------------')
        console.log(ancestors);
        console.log('--------------------------------------')
    }
}

const visitQuery = (query, visitor) => {
    const q = parse(query)
    visit(q, visitor)
};

visitQuery(query, visitor);