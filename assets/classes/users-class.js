
const date = require('date-and-time')

let db, config


module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Users
}

let Users = class {
	//retourne utilisateur par Id
	static getByID(id){
		return new Promise((next) => {
			db.query('SELECT * FROM users WHERE id = ?', [id])
				.then((result) =>  {
					if(result[0] != undefined)
						next(result[0])
					else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
	}
	
	//connexion
	static login(email,password){
		return new Promise((next)=> {
			db.query('SELECT * FROM users WHERE email = ? AND password = ? AND client = ?', [email,password,"true"])
				.then((result) => {
					if(result[0] != undefined){
						next(result[0])
					}else
						next(new Error(config.errors.wrongEmailOrPwd)) 
				})
				.catch((err) => reject(err))
		})
	}


	//connexion
	static loginPro(email,password){
		return new Promise((next)=> {
			db.query('SELECT * FROM users WHERE email = ? AND password = ? AND client = ?', [email,password,"false"])
				.then((result) => {
					if(result[0] != undefined){
						next(result[0])
					}else
						next(new Error(config.errors.wrongEmailOrPwd)) 
				})
				.catch((err) => reject(err))
		})
	}

	//connexion
	static loginAndroid(email,password){
		return new Promise((next)=> {
			db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email,password])
				.then((result) => {
					if(result[0] != undefined){
						next(result[0])
					}else
						next(new Error(config.errors.wrongEmailOrPwd)) 
				})
				.catch((err) => reject(err))
		})
	}
	
	//creation d'un utilisateur
	static createUser(first_name, last_name, email, password, birthday){		
		return new Promise((next) =>{
			if(email!=undefined && email.trim()!=''){
				//verifie que l'email n'est pas deja pris
				email=email.trim()
				db.query('SELECT * FROM users WHERE email = ?',[email])
					.then((result) => {
						if(result[0]!= undefined){
							next(new Error(config.errors.emailAlreadyTaken))
						}else{
							//ajoute la personne à la bd puis la retourne
							if(first_name == undefined || first_name.trim()=='') first_name = "non renseigné"
							if(last_name == undefined || last_name.trim()=='') last_name = "non renseigné"
							if(email == undefined || email.trim()=='') email = "non renseigné"
							if(birthday == undefined || birthday.trim()=='' ) birthday = "1970/01/01 00:00:00"
							const now = new Date()
							return db.query('INSERT INTO users(first_name, last_name, email, password, birthday, date_inscription, client) VALUES(?, ?, ?, ?, ?, ?,?)', [first_name, last_name, email, password, birthday, date.format(now,'ddd. MMM. DD YYYY'),'true'])
						}
					})
					.then(() => {
						return db.query('SELECT * FROM users WHERE email = ?',[email])
					})
					.then((result) => {
						next({
							id: result[0].id,
							last_name: result[0].last_name,
							first_name: result[0].first_name,
					        email: result[0].email,
					        birthday: result[0].birthday,
					        password: result[0].password,
							date_inscription: result[0].date_inscription,
							client: result[0].client
						})
					})
					.catch((err) => next(err))
			}else{
				next(new Error("eamil already used or password missing"))
			}
		})
	}
	
	//creation d'un utilisateur
	static createUserPro(first_name, last_name, email, password, birthday){
				return new Promise((next) =>{
			if(email!=undefined && email.trim()!=''){
				//verifie que l'email n'est pas deja pris
				email=email.trim()
				db.query('SELECT * FROM users WHERE email = ?',[email])
					.then((result) => {
						if(result[0]!= undefined){
							next(new Error(config.errors.emailAlreadyTaken))
						}else{
							//ajoute la personne à la bd puis la retourne
							if(first_name == undefined || first_name.trim()=='') first_name = "non renseigné"
							if(last_name == undefined || last_name.trim()=='') last_name = "non renseigné"
							if(email == undefined || email.trim()=='') email = "non renseigné"
							if(birthday == undefined || birthday.trim()=='' ) birthday = "1970/01/01 00:00:00"
							const now = new Date()
							return db.query('INSERT INTO users(first_name, last_name, email, password, birthday, date_inscription, client) VALUES(?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, email, password, birthday, date.format(now,'ddd. MMM. DD YYYY'),'false'])
						}
					})
					.then(() => {
						return db.query('SELECT * FROM users WHERE email = ?',[email])
					})
					.then((result) => {
						next({
							id: result[0].id,
							last_name: result[0].last_name,
							first_name: result[0].first_name,
					        email: result[0].email,
					        birthday: result[0].birthday,
					        password: result[0].password,
							date_inscription: result[0].date_inscription,
							client: result[0].client
						})
					})
					.catch((err) => next(err))
			}else{
				next(new Error("eamil already used or password missing"))
			}
		})
	}

	static delete(id){
		return new Promise((next) => {
			db.query('SELECT * FROM users WHERE id = ?',[id])
				.then((result) => {
					if(result[0] != undefined){
						return db.query('DELETE FROM users WHERE id =?', [id])
					}else{
						next(new Error(config.errors.unknownID))
					}
				})
				.then(() => next(true))
				.catch((err) => next(err))		
		})
	}

	static getAll(max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM users WHERE client = "true" LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM users WHERE client = "true"')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}

	static getAllPro(max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM users WHERE client = "false" LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM users WHERE client = "false"')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}

	static update(id, first_name, last_name, email, birthday){
		return new Promise((next) => {
			if(email!=undefined && email.trim()!=''){
				email = email.trim()
				db.query('SELECT * FROM users WHERE id = ? AND email = ? ',[id, email])
					.then((result) => {
						if(result[0]==undefined ){
							next(new Error('Non existing account'))
						}else{
							db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
									if(last_name == undefined || last_name.trim() =='')
										last_name = result[0].last_name
									else
										last_name = last_name.trim()

									if(first_name == undefined || first_name.trim() =='')
										first_name = result[0].first_name
									else
										first_name = first_name.trim()

									if(birthday == undefined || birthday.trim() == '')
										birthday = result[0].birthday
									else
										birthday = birthday

									return db.query('UPDATE users SET  first_name = ?, last_name = ?, birthday = ? WHERE id = ?',[first_name, last_name, birthday, id])
							})
						}
					})
					.then(() => next(true))
					.catch((err) => next(err))
			}else{
				next(new Error('no email value'))
			}
		})
	}

	static updatePwd(id, password){
			return new Promise((next) => {
			if(password!=undefined && password.trim()!=''){
				password = password.trim()
				db.query('SELECT * FROM users WHERE id = ?',[id])
					.then((result) => {
						if(result[0] != undefined){
							return db.query('SELECT * FROM users WHERE password = ? AND id = ?',[password, id])
						}else{
							next(new Error(config.errors.unknownID))
						}
					})
					.then((result) => {
						if(result[0]!=undefined ){
							next(new Error('new password cant be old password'))
						}else{
							return db.query('UPDATE users SET password = ? WHERE id = ?',[password, id])
						}
					})
					.then(() => next(true))
					.catch((err) => next(err))
			}else{
				next(new Error('no password value'))
			}
		})
	}
}