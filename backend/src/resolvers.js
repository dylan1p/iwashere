const r = require('rethinkdb');
const { pubsub } = require('./pubsub');
const { withFilter } = require('graphql-subscriptions');
const SOMETHING_CHANGED_TOPIC = 'checkpoints';

const Query = {
	listCheckPoints : function (_, args, { db }) {
		return r.table('checkpoint').run(db)
			.then(cursor => cursor.toArray())
			.then(arr => arr);
	}
}



const Subscription = {
	checkpoints : {
	  resolve: (payload, args, context, info) => {
		// Manipulate and return the new value

		return payload;
	  }
	  subscribe: () => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC),
	}
}

module.exports = {
	Query,
	Subscription
};
