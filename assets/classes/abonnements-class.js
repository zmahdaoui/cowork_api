let db, config

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Abonnements
}

let Abonnements = class {
    static getByID(id){
		return new Promise((next) => {
			db.query('SELECT * FROM abonnement WHERE id = ?', [id])
				.then((result) =>  {
					if(result[0] != undefined)
						next(result[0])
					else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
    }

    static getAll(max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM abonnement LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM abonnement')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}

    static createAbonnement(name, price, commitment){		
		return new Promise((next) =>{
			if(name != undefined && name.trim()!=''){
				name=name.trim()
				db.query('SELECT * FROM abonnement WHERE name = ? AND commitment = ?',[name, commitment])
					.then((result) => {
						if(result[0]!= undefined){
							next(new Error(config.errors.abonnementAlreadyExist))
						}else{
							if(price == undefined ) price = 0
							if(commitment == undefined ) commitment = 0

							return db.query('INSERT INTO abonnement(name, price, commitment) VALUES(?, ?, ?)', [name, price, commitment])
						}
					})
					.then(() => {
						return db.query('SELECT * FROM abonnement WHERE name = ? AND commitment = ?',[name,commitment])
					})
					.then((result) => {
						next({
							id: result[0].id,
							name: result[0].name,
							price: result[0].price,
					        commitment: result[0].commitment
						})
					})
					.catch((err) => next(err))
			}else{
				next(new Error("name already used"))
			}
		})
    }
    
    static update(id, name, price, commitment){
		return new Promise((next) => {
			if(name!=undefined){
				name = name.trim()
				db.query('SELECT * FROM abonnement WHERE id = ?',[id])
					.then((result) => {
						if(result[0]==undefined ){
							next(new Error('Non existing abonnement')) 
						}else{
							db.query('SELECT * FROM abonnement WHERE id = ?', [id], (err, result) => {
									if(name == undefined || name.trim() =='')
										name = result[0].name
									else
										name = name.trim()
										
									if(price == undefined || price == 0  )
                                        price = result[0].price
									else
                                        price = price	
                                    
                                    if(commitment == undefined)
                                        commitment = result[0].commitment
									else
                                        commitment = commitment
										
									return db.query('UPDATE abonnement SET name = ?, price = ?, commitment = ? WHERE id = ?',[name, price, commitment, id])
							})
						}
					})
					.then(() => next(true))
					.catch((err) => next(err))
			}else{
				next(new Error('no name value'))
			}
		})
	}

}