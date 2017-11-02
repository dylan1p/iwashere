const fs = require("fs");
const resolvers = require('./resolvers');
const { makeExecutableSchema } = require("graphql-tools");
const { graphqlKoa, graphiqlKoa } = require("graphql-server-koa");

let typeDefs;
try {
	typeDefs = fs.readFileSync(__dirname + "/api.graphql", "utf-8");
} catch (err) {
	throw new Error(`Could not find the api.graphql file. Reason : ${err}`);
}

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})

exports.graphqlAPI = graphqlKoa(ctx => ({
	schema,
	context : {
		db: ctx.db
	}
}));

exports.graphIQL = options => graphiqlKoa(options);
