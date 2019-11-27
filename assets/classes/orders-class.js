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
						if(time == undefined || time.trim()=='') time = 'non renseigné'
						
						var date_order_string = ''
						if(date_order != undefined || date_order.trim()!=''){
							const date_order_parse = date.parse(date_order ,'YYYY/MM/DD HH:mm:ss')
							date_order_string = date.format(date_order_parse, 'ddd. MMM. DD YYYY, HH:mm:SS')
						}else{
							date_order_string = date.format(new Date(), 'ddd. MMM. DD YYYY, HH:mm:SS')
						}

						var hour = time.split(':');
						hour = parseInt(hour[0],10)
						var day = date_order_string.substring(0,3)
						if(day == 'Sat' || day == 'Sun'){
							var schedule = result[0].schedule_we.split(',')
							var schedule_s = parseInt(schedule[0],10) 
							var schedule_e = parseInt(schedule[1],10)
							if(hour< schedule_s || hour>schedule_e)
								next(Error('Horaire du jour '+schedule))
						}else if(day == 'Fri'){
							var schedule = result[0].schedule_f.split(',')
							var schedule_s = parseInt(schedule[0],10) 
							var schedule_e = parseInt(schedule[1],10)
							if(hour< schedule_s || hour>schedule_e)
								next(Error('Horaire du jour '+schedule))
						}else{
							var schedule = result[0].schedule_mt.split(',')
							var schedule_s = parseInt(schedule[0],10) 
							var schedule_e = parseInt(schedule[1],10)
							if(hour< schedule_s || hour>schedule_e)
								next(Error('Horaire du jour '+schedule))
						}

						return db.query('INSERT INTO orders(location, date_order, user_id, count, time) VALUES(?, ?, ?, ?, ?)', [location, date_order_string, user_id, count, time])						
					}else{
						next(new Error(config.errors.unknownLocation))
					}
				})
				.then(() => {
					var date_order_string = ''
					if(date_order != undefined || date_order.trim()!=''){
						const date_order_parse = date.parse(date_order ,'YYYY/MM/DD HH:mm:ss')
						date_order_string = date.format(date_order_parse, 'ddd. MMM. DD YYYY, HH:mm:SS')
					}else{
						date_order_string = date.format(new Date(), 'ddd. MMM. DD YYYY, HH:mm:SS')
					}
					return db.query('SELECT * FROM orders WHERE location = ? AND date_order = ? AND user_id = ? AND count = ? AND time = ?',[location, date_order_string, user_id, count, time])
				})
				.then((result) => {
					next({
						id: result[0].id,
						location: result[0].location,
						date_order: result[0].date_order,
						user_id: result[0].user_id,
						count: result[0].count,
						time: result[0].time
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

	static getUserOrders(user_id){
		return new Promise((next) => {
			db.query('SELECT * FROM orders WHERE user_id = ?  ORDER BY id DESC', [user_id])
				.then((result) =>  {
					if(result != []){				
						next(result)
					}else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
	}
	
	static getOpenspaceOrders(location){
		return new Promise((next) => {
			db.query('SELECT * FROM open_space WHERE location = ?', [location])
				.then((result) => {
					if(result != null){
						var date_order_string = ''
						var date_order_sub = ''							
						date_order_string = date.format(new Date(), 'ddd. MMM. DD YYYY, HH:mm:SS')
						date_order_sub = date_order_string.substring(0,17)
						date_order_sub = date_order_sub+'%'
						console.log(date_order_sub)

						db.query('SELECT * FROM orders WHERE location = ? AND date_order LIKE ?', [location, date_order_sub])
							.then((orders) => {
								if(orders == undefined || orders.length == 0){
									next(new Error(config.errors.noOrderFound))
								}else{
									let i = 0
									let emails = []
									orders.forEach(order => {
										db.query('SELECT * FROM users WHERE id = ?', [order.user_id])
											.then((result) => {
												emails.push(result[0].email)
												order['email'] = result[0].email
												order['first_name'] = result[0].first_name
												order['last_name'] = result[0].last_name
											})
											.then(()=>{
												if(emails.length == orders.length){
													next(orders)
												}
											})
									})
								}
							})
					}else{						
						next(new Error(config.errors.unknownLocation))
					}
				})
		})
	}
}