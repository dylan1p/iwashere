const fs = require("fs");
const { makeExecutableSchema } = require("graphql-tools");
const { graphqlKoa, graphiqlKoa } = require("graphql-server-koa");

let typeDefs;
try {
	typeDefs = fs.readFileSync(__dirname + "/api.graphql", "utf-8");
} catch (err) {
	throw new Error(`Could not find the api.graphql file. Reason : ${err}`);
}

const resolvers = {
	Query : {
		me : function () {
			return {
				id : 1,
				name : "me"
			}
		}
	}
}

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})

exports.graphqlAPI = graphqlKoa({ schema });

exports.graphIQL = options => graphiqlKoa(options);

