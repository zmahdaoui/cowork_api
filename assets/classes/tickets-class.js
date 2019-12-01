let db, config

const date = require('date-and-time')

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Tickets
}

let Tickets = class {
	
    static createTicket(name, id_user, user_name, type, description, location){		
		return new Promise((next) =>{
            //verifie que l'email n'est pas deja pris
            db.query('INSERT INTO ticket(name, date_creation, status, id_user, user_name, type, description, location, open, resolved) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[name,  date.format(new Date(),'ddd. MMM. DD YYYY'), "new", id_user, user_name, type, description, location, 'true', 'false'])
                .then(()=>{
                    return db.query('SELECT * FROM ticket WHERE name = ? AND id_user = ?', [name, id_user])
                })
                .then((result) => {
                    next({
                        id: result[0].id,
                        name: result[0].name,
                        date_creation: result[0].date_creation,
                        status: result[0].status,
                        id_user: result[0].id_user,
                        user_name: result[0].user_name,
                        type: result[0].type,
                        description: result[0].description,
                        location: result[0].location,
                        open: result[0].open,
                        resolved: result[0].resolved
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
	
	static getNewTicket(max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE status = ? ORDER BY id DESC LIMIT 0, ?',["new", parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE status = ? ORDER BY id DESC', ["new"])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	static getClientNewTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE status = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["new", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE status = ? AND id_user = ? ORDER BY id DESC', ["new", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
    }
    
    static update(id, status, open, resolved){
		return new Promise((next) => {
			if(id!=undefined ){
				db.query('SELECT * FROM ticket WHERE id = ? ',[id])
					.then((result) => {
						if(result[0]==undefined ){
							next(new Error('Non existing ticket')) 
						}else{
							if(status == undefined || status.trim() =='')
								status = result[0].status
							else
								status = status.trim()	
									
							if(open == undefined || open.trim() =='')
								open = result[0].open
							else
								open = open.trim()
								
							if(resolved == undefined || resolved.trim() == '')
								resolved = result[0].resolved
							else
								resolved = resolved							
									
							return db.query('UPDATE ticket SET  status = ?, open = ?, resolved = ? WHERE id = ?',[status, open, resolved, id])
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