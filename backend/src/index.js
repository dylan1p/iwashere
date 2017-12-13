const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const log = require("winston");
const r = require('rethinkdb');
const config = require("../config");
const PORT = config.port;
const { graphqlAPI, graphIQL, schema } = require("./graphql");
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { pubsub } = require('./pubsub');

const WS_PORT = 5000;
const app = new Koa();
const router = new Router();

const websocketServer = createServer((request, response) => {
	response.writeHead(404);
	response.end();
});

let db;
const databaseMiddleware = async (ctx, next) => {
	if(!db) {
		try {
			db = await r.connect(config.db);
			log.info('Connection established ...');
		} catch (e) {
			log.error(`Could not connect to DB : ${e}`)
		}
	}
	ctx.db = db;
	await next();
}

const subscriptionServer = SubscriptionServer.create(
	{
		schema,
		execute,
		subscribe
	},
	{
		server: websocketServer,
		reconnect: true,
		path: '/graphql',
	}
)

router.post("/api/graphql", graphqlAPI);
router.get(
	"/api/graphiql",
	graphIQL({
		endpointURL: "/api/graphql",
		subscriptionsEndpoint: "ws://localhost:5000/graphql"
	})
);

app
	.use(databaseMiddleware)
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods());

async function main () {
	log.info(`--------------------------------------------------`);
	log.info(`Starting iWasHere`);
	log.info(``);

	app.listen(PORT, () => {
		log.info(`Server is running on http://localhost:${PORT}`);
		log.info(``);
	});

	websocketServer.listen(WS_PORT, () => {
		console.log(`Websocket Server is now running on ws://localhost:${WS_PORT}`)
	});

}

if (require.main === module) {
	main().catch(err => {
		log.error(err);
		process.exit(-1);
	});
}
