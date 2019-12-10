let db, config

const date = require('date-and-time')

module.exports = (_db, _config) => {
	db=_db
	config=_config
	return Tickets
}

let Tickets = class {
	
    static createTicket(name, id_user, user_name, type, material_id, description, location){		
		return new Promise((next) =>{
            //verifie que l'email n'est pas deja pris
            db.query('INSERT INTO ticket(name, date_creation, status, id_user, user_name, id_owner, owner_name, type, material_id, description, location, open, resolved, late) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[name,  date.format(new Date(),'ddd. MMM. DD YYYY'), "new", id_user, user_name, 0, 'null', type, material_id, description, location, 'true', 'false','false'])
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
                        id_owner: result[0].id_owner,
                        owner_name: result[0].owner_name,
                        type: result[0].type,
                        material_id: result[0].material_id,
                        description: result[0].description,
                        location: result[0].location,
                        open: result[0].open,
                        resolved: result[0].resolved
                    })
                })
        })
    }
	    
    static getTechMat(location,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM tech_mat WHERE location = ? LIMIT 0, ?',[location, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM tech_mat WHERE location = ?', [location])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
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
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? ORDER BY id DESC LIMIT 0, ?',["false", "new", "true", "false", parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? ORDER BY id DESC', ["false", "new", "true", "false"])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
		
	static getProLateTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){//
				db.query('SELECT * FROM ticket WHERE (late = ? AND open = ? AND resolved = ? AND id_owner = ?) OR (late = ? AND open = ? AND resolved = ? AND status = ? AND id_owner = ?) ORDER BY id DESC LIMIT 0, ?',["true", "true", "false", id, "true", "true", "false", "new", 0, parseInt(max)])
					.then( (result) => {
						console.log(result)
						next(result)
					})
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE (late = ? AND open = ? AND resolved = ? AND id_owner = ?) OR (late = ? AND open = ? AND resolved = ? AND status = ? AND id_owner = ?) ORDER BY id DESC', ["true", "true", "false", id, "true", "true", "false", "new", 0])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}

	static getProInProgressTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_owner = ? ORDER BY id DESC LIMIT 0, ?',["false", "in progress", "true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_owner = ? ORDER BY id DESC', ["false", "in progress", "true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	
	static getProWaitingTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_owner = ? ORDER BY id DESC LIMIT 0, ?',["false", "waiting", "true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_owner = ? ORDER BY id DESC', ["false", "waiting", "true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}

	static getProClosedTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE open = ? AND resolved = ? AND id_owner = ? ORDER BY id DESC LIMIT 0, ?',["false", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE open = ? AND resolved = ? AND id_owner = ? ORDER BY id DESC', ["false", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
    }
	
	static getProResolvedTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE resolved = ? AND open = ? AND id_owner = ? ORDER BY id DESC LIMIT 0, ?',["true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE resolved = ? AND open = ? AND id_owner = ? ORDER BY id DESC', ["true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	
	static getClientNewTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["false","new", "true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC', ["false","new", "true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	
	static getClientLateTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE late = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["true", "true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND open = ? AND resolved = ?  AND id_user = ? ORDER BY id DESC', ["true", "true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	
	static getClientInProgressTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["false", "in progress", "true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC', ["false", "in progress", "true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
    }
	
	static getClientWaitingTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["false", "waiting", "true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE late = ? AND status = ? AND open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC', ["false", "waiting", "true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	
	static getClientClosedTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["false", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE open = ? AND resolved = ? AND id_user = ? ORDER BY id DESC', ["false", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
	}
	
	static getClientResolvedTicket(id,max){
		return new Promise((next) => {
			if(max !=undefined && max>0 ){
				db.query('SELECT * FROM ticket WHERE resolved = ? AND open = ? AND id_user = ? ORDER BY id DESC LIMIT 0, ?',["true", "false", id, parseInt(max)])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}else if ( max !=undefined){
				next(new Error(config.errors.wrongMaxValue))
			}else {
				db.query('SELECT * FROM ticket WHERE resolved = ? AND open = ? AND id_user = ? ORDER BY id DESC', ["true", "false", id])
					.then( (result) => next(result))
					.catch((err) => next(err))
			}
		})
    }

    static update(id, status, id_owner, owner_name, open, resolved, late){
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

							if(id_owner == undefined )
								id_owner = result[0].id_owner
							else
								id_owner = id_owner	
									
							if(owner_name == undefined || owner_name.trim() =='')
								owner_name = result[0].owner_name
							else
								owner_name = owner_name.trim()
							
							if(open == undefined || open.trim() =='')
								open = result[0].open
							else
								open = open.trim()
								
							if(resolved == undefined || resolved.trim() == '')
								resolved = result[0].resolved
							else
								resolved = resolved							
									
							if(late == undefined || late.trim() == '')
								late = result[0].late
							else
								late = late							
										
							return db.query('UPDATE ticket SET  status = ?, id_owner = ?, owner_name = ?, open = ?, resolved = ?, late = ? WHERE id = ?',[status, id_owner, owner_name, open, resolved, late,id])
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