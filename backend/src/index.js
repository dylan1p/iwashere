const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const log = require("winston");

const config = require("../config");
const PORT = config.port;
const { graphqlAPI, graphIQL } = require("./graphql");

const app = new Koa();
const router = new Router();


router.post("/api/graphql", graphqlAPI);
router.get(
  "/api/graphiql",
  graphIQL({
    endpointURL: "/api/graphql"
  })
);

app
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())

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
