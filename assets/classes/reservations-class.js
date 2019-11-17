const date = require('date-and-time')

//date.locale('fr')
let db, config

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Reservations
}

let Reservations = class {
    static getByID(id){
		return new Promise((next) => {
			db.query('SELECT * FROM reservation WHERE id = ?', [id])
				.then((result) =>  {
					if(result[0] != undefined)
						next(result[0])
					else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
	}
	
	static getUserReservations(id_user){
		return new Promise((next) => {
			db.query('SELECT * FROM reservation WHERE id_user = ?  ORDER BY id DESC', [id_user])
				.then((result) =>  {
					if(result != []){
						next(result)
					}else
						next(new Error(config.errors.unknownID))			
				})
				.catch((err) =>  reject(err))			
		})
    }
    
    static createReservation(location, type, start, end, date_res, number, id_user){
		return new Promise((next) =>{
			db.query('SELECT * FROM open_space WHERE location = ?', [location])
				.then((result) => {
					if(result[0] != undefined){
						var open_space = result[0]
						var date_res_string = ''
						var date_res_sub = ''
						if(date_res != undefined || date_res.trim()!=''){
							const date_res_parse = date.parse(date_res ,'YYYY/MM/DD HH:mm:ss')
							date_res_string = date.format(date_res_parse, 'ddd. MMM. DD YYYY, HH:mm:SS')
							date_res_sub = date_res_string.substring(0,17)
							date_res_sub = date_res_sub+'%'
						}else{
							date_res_string = date.format(new Date(), 'ddd. MMM. DD YYYY, HH:mm:SS')
							date_res_sub = date_res_string.substring(0,17)
							date_res_sub = date_res_sub+'%'
						}
						
						if(type == 'conf_room'){
							if(number > result[0].conf_room || number == 0){
								let str = "les salles de réunion du site de "+result[0].location+" :"
								let i 
								for (i = 1 ; i <= result[0].conf_room ; i++){
									str = str +' '+ i  
								}
								next(new Error(str))
								return 
							}
						}

						if(type == 'call_room'){
							if(number > result[0].call_room || number == 0){
								let str = "les salles d'appel du site de "+result[0].location+" :"
								let i 
								for (i = 1 ; i <= result[0].call_room ; i++){
									str = str +' '+ i  
								}
								next(new Error(str))
								return 
							}
						}
						
						if(type == 'cosy_room'){
							if(number > result[0].cosy_room || number == 0){
								let str = "les cosy_room du site de "+result[0].location+" :"
								let i 
								for (i = 1 ; i <= result[0].cosy_room ; i++){
									str = str +' '+ i  
								}
								next(new Error(str))
								return 
							}
						}
						if(type == 'printers'){
							if(number > result[0].printers || number == 0){
								let str = "les imprimantes du site de "+result[0].location+" :"
								let i 
								for (i = 1 ; i <= result[0].printers ; i++){
									str = str +' '+ i  
								}
								next(new Error(str))
								return 
							}
						}
						if(type == 'laptops'){
							if(number > result[0].laptops || number == 0){
								let str = "les ordinateurs du site de "+result[0].location+" :"
								let i 
								for (i = 1 ; i <= result[0].laptops ; i++){
									str = str +' '+ i  
								}
								next(new Error(str))
								return 
							}
						}

						db.query('SELECT * FROM reservation WHERE location = ? AND type = ? AND number = ? AND date_res LIKE ?', [location, type, number, date_res_sub])
							.then((result) => {
								if(result.length == 0){
									var day = date_res_string.substring(0,3)
									if(day == 'Sat' || day == 'Sun'){
										var schedule = open_space.schedule_we.split(',')
										var schedule_s = parseInt(schedule[0],10) 
										var schedule_e = parseInt(schedule[1],10)
										if(schedule_s <= start && schedule_e >=start && schedule_s <= end && schedule_e >=end){
											if(start<end){
												return db.query('INSERT INTO reservation(location, type, start, end, date_res, number, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',[location, type, start, end, date_res_string, number, id_user])
											}else{
												next(new Error("l'heure de début ne peut être postérieure à l'heure de fin"))
											}
										}else{
											next(new Error("horaire du jour "+schedule))
										}

									}else if(day == 'Fri'){
										var schedule = open_space.schedule_f.split(',')
										var schedule_s = parseInt(schedule[0],10) 
										var schedule_e = parseInt(schedule[1],10)
										if(schedule_s <= start && schedule_e >=start && schedule_s <= end && schedule_e >=end){
											if(start<end ){
												return db.query('INSERT INTO reservation(location, type, start, end, date_res, number, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',[location, type, start, end, date_res_string, number, id_user])
											}else{
												next(new Error("l'heure de début ne peut être postérieure à l'heure de fin"))
											}
										}else{
											next(new Error("horaire du jour "+schedule))
										}

									}else{
										var schedule = open_space.schedule_mt.split(',')
										var schedule_s = parseInt(schedule[0],10) 
										var schedule_e = parseInt(schedule[1],10)
										if(schedule_s <= start && schedule_e >=start && schedule_s <= end && schedule_e >=end){
											if(start<end){
												return db.query('INSERT INTO reservation(location, type, start, end, date_res, number, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',[location, type, start, end, date_res_string, number, id_user])
											}else{
												next(new Error("l'heure de début ne peut être postérieure à l'heure de fin"))
											}
										}else{
											next(new Error("horaire du jour "+schedule))
										}
									}
								}else{
									var day = date_res_string.substring(0,3)
									console.log(day)
									if(day == 'Sat' || day == 'Sun'){
										var schedule = open_space.schedule_we.split(',')
										var schedule_s = parseInt(schedule[0],10) 
										var schedule_e = parseInt(schedule[1],10)
										if(schedule_s <= start && schedule_e >=start && schedule_s <= end && schedule_e >=end){
											if(start<end){
												var plage = []
												result.forEach(element => {
													plage.push(element.end)
													plage.push(element.start)
												});
												plage.sort((a,b)=> a - b)
												var flag = false
												for(var i = 0 ; i < plage.length ; i=i+2){
													if(i == 0){
														if(start < plage[i] && end <= plage[i]){
															flag = true
															break
														}else if(i + 1 == plage.length - 1){
															if(start >= plage[i+1]){
																flag = true
																break
															}
														}
													}else{
														if(start < plage[i] && start >= plage[i-1] && end <= plage[i]){
															flag = true
															break
														}else if(i + 1 == plage.length - 1){
															if(start >= plage[i+1]){
																flag = true
																break
															}
														}
													}
												}
												if(flag){
													return db.query('INSERT INTO reservation(location, type, start, end, date_res, number, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',[location, type, start, end, date_res_string, number, id_user])
												}else{
													
													var str = type+' est déjà reservé pour'
													for(var i = 0 ; i < plage.length ; i = i + 2){
														str = str.concat(', ',plage[i],'H','-',plage[i+1],'H')
													}
													next(new Error(str))
												}
											}else{
												next(new Error("l'heure de début ne peut être postérieure à l'heure de fin"))
											}
										}else{
											next(new Error("horaire du jour "+schedule))
										}

									}else if(day == 'Fri'){
										var schedule = open_space.schedule_f.split(',')
										var schedule_s = parseInt(schedule[0],10) 
										var schedule_e = parseInt(schedule[1],10)
										if(schedule_s <= start && schedule_e >=start && schedule_s <= end && schedule_e >=end){
											if(start<end){
												var plage = []
												result.forEach(element => {
													plage.push(element.end)
													plage.push(element.start)
												});
												plage.sort((a,b)=> a - b)
												var flag = false
												for(var i = 0 ; i < plage.length ; i=i+2){
													if(i == 0){
														if(start < plage[i] && end <= plage[i]){
															flag = true
															break
														}else if(i + 1 == plage.length - 1){
															if(start >= plage[i+1]){
																flag = true
																break
															}
														}
													}else{
														if(start < plage[i] && start >= plage[i-1] && end <= plage[i]){
															flag = true
															break
														}else if(i + 1 == plage.length - 1){
															if(start >= plage[i+1]){
																flag = true
																break
															}
														}
													}
												}
												if(flag){
													return db.query('INSERT INTO reservation(location, type, start, end, date_res, number, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',[location, type, start, end, date_res_string, number, id_user])
												}else{
													var str = type+' est déjà reservé pour'
													for(var i = 0 ; i < plage.length ; i = i + 2){
														str = str.concat(', ',plage[i],'H','-',plage[i+1],'H')
														//str = str.concat(', ',plage[i],plage[i+1])
													}
													console.log(str)
													next(new Error(str))
												}
											}else{
												next(new Error("l'heure de début ne peut être postérieure à l'heure de fin"))
											}
										}else{
											next(new Error("horaire du jour "+schedule))
										}

									}else{
										var schedule = open_space.schedule_mt.split(',')
										var schedule_s = parseInt(schedule[0],10) 
										var schedule_e = parseInt(schedule[1],10)
										if(schedule_s <= start && schedule_e >=start && schedule_s <= end && schedule_e >=end){
											if(start<end){
												var plage = []
												result.forEach(element => {
													plage.push(element.end)
													plage.push(element.start)
												});
												plage.sort((a,b)=> a - b)
												console.log(plage)
												var flag = false
												for(var i = 0 ; i < plage.length ; i=i+2){
													if(i == 0){
														if(start < plage[i] && end <= plage[i]){
															flag = true
															break
														}else if(i + 1 == plage.length - 1){
															if(start >= plage[i+1]){
																flag = true
																break
															}
														}
													}else{
														if(start < plage[i] && start >= plage[i-1] && end <= plage[i]){
															flag = true
															break
														}else if(i + 1 == plage.length - 1){
															if(start >= plage[i+1]){
																flag = true
																break
															}
														}
													}
												}
												if(flag){
													return db.query('INSERT INTO reservation(location, type, start, end, date_res, number, id_user) VALUES(?, ?, ?, ?, ?, ?, ?)',[location, type, start, end, date_res_string, number, id_user])
												}else{
													var str = type+' est déjà reservé pour'
													for(var i = 0 ; i < plage.length ; i = i + 2){
														str = str.concat(', ',plage[i],'H','-',plage[i+1],'H')
													}
													next(new Error(str))
												}
											}else{
												next(new Error("l'heure de début ne peut être postérieure à l'heure de fin"))
											}
										}else{
											next(new Error("horaire du jour "+schedule))
										}
									}
								}
							})
							.then(() => {
								var date_res_string = ''
								var date_res_sub = ''
								if(date_res != undefined || date_res.trim()!=''){
									const date_res_parse = date.parse(date_res ,'YYYY/MM/DD HH:mm:ss')
									date_res_string = date.format(date_res_parse, 'ddd. MMM. DD YYYY, HH:mm:SS')
									date_res_sub = date_res_string.substring(0,17)
									date_res_sub = date_res_sub+'%'
								}else{
									date_res_string = date.format(new Date(), 'ddd. MMM. DD YYYY, HH:mm:SS')
									date_res_sub = date_res_string.substring(0,17)
									date_res_sub = date_res_sub+'%'
								}
								return db.query('SELECT * FROM reservation WHERE location = ? AND type = ? AND date_res = ? ORDER BY id DESC',[location, type, date_res_string])
							})
							.then((result) => {
								next({
									id: result[0].id,
									location: result[0].location,
									type: result[0].type,
									start: result[0].start,
									end: result[0].end,
									date_res: result[0].date_res,
									number: result[0].number
								})
							})
							.catch((err) => next(err))	
					}else{
						next(new Error(config.errors.unknownLocation))
					}
				})
				.catch((err) => next(err))
			})	
    }
    
    static delete(id){
		return new Promise((next) => {
			console.log(id)
			db.query('SELECT * FROM reservation WHERE id = ?',[id])
				.then((result) => {
					if(result[0] != undefined){
						return db.query('DELETE FROM reservation WHERE id =?', [id])
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
				db.query('SELECT * FROM reservation LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM reservation')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
}