const Query = {     
	me : function (_, args, { db }) {
		return r.table('people').run(db)
			.then(cursor => cursor.next())
	}
}

module.export = { Query };
