let db, config

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return opensSpace
}

let opensSpace = class {
	//retourne utilisateur par Id
	static getByID(id){
		return new Promise((next) => {
			db.query('SELECT * FROM open_space WHERE id = ?', [id])
				.then((result) =>  {
					if(result[0] != undefined)
						next(result[0])
					else
						next(new Error(config.errors.unknownID))
				})
				.catch((err) =>  reject(err))
		})
	}


	//creation d'un utilisateur
	static createOpenSpace(location, wifi, drink, plateau_repas, conf_room, call_room, cosy_room, printers, laptops, schedule_mt_s, schedule_mt_e, schedule_f_s, schedule_f_e, schedule_we_s, schedule_we_e, adresse){
		return new Promise((next) =>{
			if(location!=undefined && location.trim()!=''){

				location=location.trim()
				db.query('SELECT * FROM open_space WHERE location = ?',[location])
					.then((result) => {
						if(result[0]!= undefined){
							next(new Error(config.errors.locationAlreadyExist))
						}else{
							//ajoute la personne à la bd puis la retourne
							if(wifi !='true') wifi = 'false'
							if(drink !='true') drink = 'false'
							if(plateau_repas !='true') plateau_repas = 'false'
							if(conf_room == undefined ) conf_room = 0
							if(call_room == undefined ) call_room = 0
							if(cosy_room == undefined ) cosy_room = 0
							if(adresse == undefined  || adresse.trim()=='') adresse = 'not specified'

							var i = 0
							if(printers == undefined )
								printers = 0
							else{
								for(i=1; i<= printers;i++){
									db.query('INSERT INTO tech_mat(type, location, number) VALUES(?, ?, ?)', ['printer', location, i])
								}
							}

							if(laptops == undefined )
								laptops = 0
							else{
								for(i=1; i<= laptops;i++){
									db.query('INSERT INTO tech_mat(type, location, number) VALUES(?, ?, ?)', ['laptop', location, i])
								}
							}

							if(schedule_mt_s == undefined)
								schedule_mt_s = 8

							if(schedule_mt_e == undefined)
								schedule_mt_e = 21

							if(schedule_mt_s>=schedule_mt_e){
								schedule_mt_s = 8
								schedule_mt_e = 21
							}
							var schedule_mt = schedule_mt_s+','+schedule_mt_e

							if(schedule_f_s == undefined)
								schedule_f_s = 9

							if(schedule_f_e == undefined)
								schedule_f_e = 23

							if(schedule_f_s>=schedule_f_e){
								schedule_f_s = 9
								schedule_f_e = 23
							}
							var schedule_f = schedule_f_s+','+schedule_f_e

							if(schedule_we_s == undefined)
								schedule_we_s = 9

							if(schedule_we_e == undefined)
								schedule_we_e = 20

							if(schedule_we_s>=schedule_we_e){
								schedule_we_s = 9
								schedule_we_e = 20
							}
							var schedule_we = schedule_we_s+','+schedule_we_e

							return db.query('INSERT INTO open_space(location, wifi, drink, plateau_repas, conf_room, call_room, cosy_room, printers, laptops, schedule_mt, schedule_f, schedule_we, adresse) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [location, wifi, drink, plateau_repas, conf_room, call_room,cosy_room, printers, laptops, schedule_mt, schedule_f, schedule_we, adresse])
						}
					})
					.then(() => {
						return db.query('SELECT * FROM open_space WHERE location = ?',[location])
					})
					.then((result) => {
						next({
							id: result[0].id,
							location: result[0].location,
							wifi: result[0].wifi,
					        drink: result[0].drink,
					        plateau_repas: result[0].plateau_repas,
					        conf_room: result[0].conf_room,
							call_room: result[0].call_room,
							cosy_room: result[0].cosy_room,
							printers: result[0].printers,
							laptops: result[0].laptops,
							schedule_mt: result[0].schedule_mt,
							schedule_f: result[0].schedule_f,
							schedule_we: result[0].schedule_we,
							adresse: result[0].adresse
						})
					})
					.catch((err) => next(err))
			}else{
				next(new Error("location already used"))
			}
		})
	}

	static delete(id){
		return new Promise((next) => {
			db.query('SELECT * FROM open_space WHERE id = ?',[id])
				.then((result) => {
					if(result[0] != undefined){
						var i = 0
						for(i=1; i<= result[0].printers;i++){
							db.query('DELETE FROM tech_mat WHERE type = ? AND location = ? AND number = ?', ['printer', result[0].location, i])
						}
						
						for(i=1; i<= result[0].laptops;i++){
							db.query('DELETE FROM tech_mat WHERE type = ? AND location = ? AND number = ?', ['laptop', result[0].location, i])
						}
						return db.query('DELETE FROM open_space WHERE id =?', [id])
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
				db.query('SELECT * FROM open_space LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM open_space')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}


	static update(id, location, wifi, drink, plateau_repas, conf_room, call_room, cosy_room, printers, laptops, schedule_mt_s, schedule_mt_e, schedule_f_s, schedule_f_e, schedule_we_s, schedule_we_e, adresse){
		return new Promise((next) => {
			if(location!=undefined && location.trim()!=''){
				location = location.trim()
				db.query('SELECT * FROM open_space WHERE id = ? AND location = ? ',[id, location])
					.then((result) => {
						if(result[0]==undefined ){
							next(new Error('Non existing location'))
						}else{
							db.query('SELECT * FROM open_space WHERE id = ?', [id], (err, result) => {
									if(wifi == undefined)
										wifi = result[0].wifi
									else
										wifi = wifi

									if(drink == undefined)
										drink = result[0].drink
									else
										drink = drink

									if(plateau_repas == undefined)
										plateau_repas = result[0].plateau_repas
									else
										plateau_repas = plateau_repas

									if(conf_room == undefined )
										conf_room = result[0].conf_room
									else
										conf_room = conf_room

									if(call_room == undefined )
										call_room = result[0].call_room
									else
										call_room = call_room

									if(cosy_room == undefined )
										cosy_room = result[0].cosy_room
									else
										cosy_room = cosy_room

									var i = 0
									if(printers < result[0].printers ){
										for(i = result[0].printers ; i > printers; i--){
											db.query('DELETE FROM tech_mat WHERE type = ? AND location = ? AND number = ?', ['printer', location, i])
										}
									}else if(printers > result[0].printers){
										for(i = result[0].printers+1 ; i <= printers; i++){
											db.query('INSERT INTO tech_mat(type, location, number) VALUES(?, ?, ?)', ['printer', location, i])
										}
									}
									if(laptops < result[0].laptops ){
										for(i = result[0].laptops ; i > laptops; i--){
											db.query('DELETE FROM tech_mat WHERE type = ? AND location = ? AND number = ?', ['laptop', location, i])
										}
									}else if(laptops > result[0].laptops){
										for(i = result[0].laptops+1 ; i <= laptops; i++){
											db.query('INSERT INTO tech_mat(type, location, number) VALUES(?, ?, ?)', ['laptop', location, i])
										}
									}

									if(schedule_mt_s == undefined ){
										var s = result[0].schedule_mt.split(",")
										schedule_mt_s = parseInt(s[0], 10)
									}else
										schedule_mt_s = schedule_mt_s

									if(schedule_mt_e == undefined ){
										var e = result[0].schedule_mt.split(",")
										schedule_mt_e = parseInt(e[1], 10)
									}else
										schedule_mt_e = schedule_mt_e

									if(schedule_mt_s>= schedule_mt_e){
										var s = result[0].schedule_mt.split(",")
										schedule_mt_s = parseInt(s[0], 10)
										schedule_mt_e = parseInt(s[1], 10)
									}

									var schedule_mt = schedule_mt_s+','+schedule_mt_e

									if(schedule_f_s == undefined ){
										var s = result[0].schedule_f.split(",")
										schedule_f_s = parseInt(s[0], 10)
									}else
										schedule_f_s = schedule_f_s

									if(schedule_f_e == undefined ){
										var e = result[0].schedule_f.split(",")
										schedule_f_e = parseInt(e[1], 10)
									}else
										schedule_f_e = schedule_f_e

									if(schedule_f_s>= schedule_f_e){
										var s = result[0].schedule_f.split(",")
										schedule_f_s = parseInt(s[0], 10)
										schedule_f_e = parseInt(s[1], 10)
									}

									var schedule_f = schedule_f_s+','+schedule_f_e

									if(schedule_we_s == undefined ){
										var s = result[0].schedule_we.split(",")
										schedule_we_s = parseInt(s[0], 10)
									}else
										schedule_we_s = schedule_we_s

									if(schedule_we_e == undefined ){
										var e = result[0].schedule_we.split(",")
										schedule_we_e = parseInt(e[1], 10)
									}else
										schedule_we_e = schedule_we_e

									if(schedule_we_s>= schedule_we_e){
										var s = result[0].schedule_we.split(",")
										schedule_we_s = parseInt(s[0], 10)
										schedule_we_e = parseInt(s[1], 10)
									}

									var schedule_we = schedule_we_s+','+schedule_we_e

									if(adresse == undefined  || adresse.trim()=='') adresse = result[0].adresse

									return db.query('UPDATE open_space SET  wifi = ?, drink = ?, plateau_repas = ?, conf_room = ?, call_room = ?, cosy_room = ?, printers = ?, laptops = ?, schedule_mt = ?, schedule_f = ?, schedule_we = ?, adresse = ?  WHERE id = ?',[wifi, drink, plateau_repas, conf_room, call_room,cosy_room, printers, laptops, schedule_mt, schedule_f, schedule_we, adresse, id])
							})
						}
					})
					.then(() => next(true))
					.catch((err) => next(err))
			}else{
				next(new Error('no location value'))
			}
		})
	}
}