const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const log = require("winston");
const r = require('rethinkdb');
const config = require("../config");
const PORT = config.port;
const { graphqlAPI, graphIQL } = require("./graphql");

const app = new Koa();
const router = new Router();

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

router.post("/api/graphql", graphqlAPI);
router.get(
  "/api/graphiql",
  graphIQL({
	endpointURL: "/api/graphql"
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
}

if (require.main === module) {
  main().catch(err => {
	log.error(err);
	process.exit(-1);
  });
}
