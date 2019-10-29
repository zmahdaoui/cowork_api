const date = require('date-and-time')

let db, config

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Subscriptions
}

let Subscriptions = class {
    static getByID(id){
		return new Promise((next) => {
			db.query('SELECT * FROM subscriptions WHERE id = ?', [id])
				.then((result) =>  {
					if(result[0] != undefined)
						next(result[0])
					else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
    }
    
    static createSubscription(subscription_type, user_id){
		return new Promise((next) =>{
			if(subscription_type != undefined && user_id != undefined){
				const now = new Date()
				var end = ''
				if(subscription_type == 8 || subscription_type == 9){
					end = date.addMonths(now,1)
				}else if(subscription_type == 7 ){
					end = date.addYears(now,1)
				}else if(subscription_type == 10){
					end = date.addMonths(now,8)
				}

                db.query('INSERT INTO subscriptions(subscription_type, user_id, subscription_date, subscription_end) VALUES(?, ?, ?, ?)', [subscription_type, user_id, date.format(now,'ddd. MMM. DD YYYY, HH:mm:SS'), date.format(end,'ddd. MMM. DD YYYY, HH:mm:SS')])
                    .then(() => {
                        return db.query('SELECT * FROM subscriptions ORDER BY id DESC LIMIT 1')
                    })
                    .then((result) => {
                        next({
                            id: result[0].id,
                            subscription_type: result[0].subscription_type,
                            user_id: result[0].user_id,
							subscription_date: result[0].subscription_date,
							subscription_end: result[0].subscription_end
                        })
                    })
					.catch((err) => next(err))
			}else{
				next(new Error("subscription_type or user_id missing, cant create subscription"))
			}
		})
    }
    
    static delete(id){
		return new Promise((next) => {
			console.log(id)
			db.query('SELECT * FROM subscriptions WHERE user_id = ?',[id])
				.then((result) => {
					if(result[0] != undefined){
						console.log(result[0])
						return db.query('DELETE FROM subscriptions WHERE user_id = ?', [id])
					}else{
						next(new Error(config.errors.unknownID))
					}
				})
				.then(() => next(true))
				.catch((err) => next(err))		
		})
	}

	static getUserAbonnement(user_id){
		return new Promise((next) => {
			db.query('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id DESC LIMIT 1', [user_id])
				.then((result) => {
					if(result[0] != undefined){
						return db.query('SELECT * FROM abonnement WHERE id = ?',result[0].subscription_type)
									.then((result) => {
										if(result[0] != undefined){
											next(result[0])
										}else{
											next(new Error(config.errors.unknownID))
										}
									})
					}else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))
		})
	}

	static getUserSubscription(user_id){
		return new Promise((next) => {
			db.query('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id DESC LIMIT 1', [user_id])
				.then((result) => {
					if(result[0] != undefined){
						next(result[0])	
					}else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))
		})
	}
}