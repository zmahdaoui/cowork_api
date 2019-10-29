let db, config

const date = require('date-and-time')

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Tickets
}

let Tickets = class {
    static createTicket(name, status, id_user, type, description, location){		
		return new Promise((next) =>{
            //verifie que l'email n'est pas deja pris
            db.query('INSERT INTO ticket(name, date_creation, status, id_user, type, description, location) VALUES(?, ?, ?, ?, ?, ?, ?)',[name,  date.format(new Date(),'ddd. MMM. DD YYYY'), status, id_user, type, description, location])
                .then(()=>{
                    return db.query('SELECT * FROM ticket WHERE name = ? AND id_user = ?', [name, id_user])
                })
                .then((result) => {
                    next({
                        id: result[0].id,
                        name: result[0].last,
                        date_creation: result[0].date_creation,
                        status: result[0].status,
                        id_user: result[0].id_user,
                        type: result[0].type,
                        description: result[0].description,
                        location: result[0].location
                    })
                })
        })
    }
    
    static getAll(max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket LIMIT 0, ?',[parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket')
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
    }
    
    static update(id, status){
		return new Promise((next) => {
			if(id!=undefined ){
				db.query('SELECT * FROM ticket WHERE id = ? ',[id])
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
				next(new Error('no ticket id specified'))
			}
		})
	}
    
}