let db, config

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Messages
}

let Messages = class {
	static getMessages(id, id2){
		return new Promise((next) => {
			return new Promise((next) => {
				db.query('SELECT * FROM user WHERE id_user = ?', [id, id2])
					.then((result) =>  {
						if(result[0] != undefined)
							next(result[0])
						else
							next(new Error(config.errors.wrongID))			
					})
					.catch((err) =>  reject(err))			
			})
		})
	}
	
}