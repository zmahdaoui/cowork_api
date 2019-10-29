const date = require('date-and-time')

//date.locale('fr')

let db, config

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Orders
}

let Orders = class {
    static getByID(id){
		return new Promise((next) => {
			db.query('SELECT * FROM orders WHERE id = ?', [id])
				.then((result) =>  {
					if(result[0] != undefined)
						next(result[0])
					else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
    }
    
    static createOrder(location, date_order, user_id, count, time){
		return new Promise((next) =>{
			db.query('SELECT * FROM open_space WHERE location = ?', [location])
				.then((result) => {
					if(result[0] != undefined){
						if(user_id == undefined ) user_id = 0
						if(count == undefined) count = 0
						if(time != undefined || time.trim()!='') time = 'non renseigné'
						var date_order_string = ''
						if(date_order != undefined || date_order.trim()!=''){
							const date_order_parse = date.parse(date_order ,'YYYY/MM/DD HH:mm:ss')
							date_order_string = date.format(date_order_parse, 'ddd. MMM. DD YYYY, HH:mm:SS')
						}else{
							date_order_string = date.format(new Date(), 'ddd. MMM. DD YYYY, HH:mm:SS')
						}
						return db.query('INSERT INTO orders(location, date_order, user_id, count, time) VALUES(?, ?, ?, ?, ?)', [location, date_order_string, user_id, count, time])						
					}else{
						next(new Error(config.errors.unknownLocation))
					}
				})
				.then(() => {
					return db.query('SELECT * FROM orders WHERE location = ? AND date_order = ? AND user_id = ? AND count = ? AND time = ?',[location, date_order, user_id, count, time])
				})
				.then((result) => {
					next({
						id_user: result[0].id,
						last_name: result[0].last_name,
						first_name: result[0].first_name,
						email: result[0].email,
						age: result[0].age,
						password: result[0].password,
						date_inscription: result[0].date_inscription,
						client: result[0].client
					})
				})
				.catch((err) => next(err))
			})	
    }
    
    static delete(id){
		return new Promise((next) => {
			db.query('SELECT * FROM orders WHERE id = ?',[id])
				.then((result) => {
					if(result[0] != undefined){
						return db.query('DELETE FROM orders WHERE id =?', [id])
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
				db.query('SELECT * FROM orders LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM orders')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
}