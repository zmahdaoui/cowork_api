/*if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}*/
require('babel-register')
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const jwt = require('jsonwebtoken')
const {success,error,checkAndChange} = require('./assets/module2')
const bodyParser = require('body-parser')
const morgan = require('morgan') ('dev')
const config = require('./assets/config')
const mysql = require('promise-mysql')
const cors = require('cors')
const app = express()
const date = require('date-and-time')

console.log(process.env.API_KEY)

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

//connection à la bd
mysql.createConnection({
	host : config.db.host,
	database : config.db.database,
	user : config.db.user,
	password : config.db.password
}).then((db) =>{
	console.log('Connected')
	let UsersRouter = express.Router()
	let Users = require('./assets/classes/users-class')(db, config )
	let Subscriptions = require('./assets/classes/subscriptions-class')(db, config )
	let OpenSapce = require('./assets/classes/opens-space-class')(db, config )
	let Reservation = require('./assets/classes/reservations-class')(db, config )
	let Orders = require('./assets/classes/orders-class')(db, config )
	let Abonnement = require('./assets/classes/abonnements-class')(db, config )
	let Ticket = require('./assets/classes/tickets-class')(db,config)
	let Mail = require('./assets/classes/mails-class')(db,config)

	app.use(morgan)
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
		res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET')
		next();
	});
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));


	/////////////////////////Users/////////////////////
	UsersRouter.route('/users')
		.get(verifyToken, async (req,res) => {
			let All = await Users.getAll(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(All))
				}
			})
		})

	UsersRouter.route('/users/pro')
		.get(verifyToken, async (req,res) => {
			let All = await Users.getAllPro(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(All))
				}
			})
		})

	UsersRouter
		.route('/users/:id')
		.get(verifyToken, async (req,res) => {// get user by id
			let user = await Users.getByID( req.params.id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(user))
				}
			})
		})

		.delete(verifyToken, async (req,res) => {
			let deleted = await Users.delete(req.params.id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(deleted))
				}
			})
		})

		.put(verifyToken, async (req, res) => {
			let updated = await Users.update(req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.age)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(updated))
				}
			})
		})

	UsersRouter.route('/users/login')
		.post(async (req,res) => {//login
			let logger = await Users.login(req.body.email, req.body.password)
			if(logger.id != undefined ){
				jwt.sign({logger}, process.env.API_KEY, {expiresIn: '30m'}, (err, token) => {
					res.json(checkAndChange(
						{
						logger,
						token
						}))
				})
			}else{
				res.json(checkAndChange(logger))
			}
		})
	
	UsersRouter.route('/android/login')
		.post(async (req,res) => {//login
			let logger = await Users.loginAndroid(req.body.email, req.body.password)
			if(logger.id != undefined ){
				jwt.sign({logger}, process.env.API_KEY, {expiresIn: '30m'}, (err, token) => {
					res.json(checkAndChange(
						{
						logger,
						token
						}))
				})
			}else{
				res.json(checkAndChange(logger))
			}
		})

	UsersRouter.route('/users/loginpro')
		.post(async (req,res) => {//login
			let logger = await Users.loginPro(req.body.email, req.body.password)
			if(logger.id != undefined ){
				jwt.sign({logger}, process.env.API_KEY, {expiresIn: '30m'}, (err, token) => {
					res.json(checkAndChange(
						{
						logger,
						token
						}))
				})
			}else{
				res.json(checkAndChange(logger))
			}
		})

	UsersRouter.route('/users/create')
		.post(async (req,res) => {
			let logger = await Users.createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.birthday)
			if(logger.id != undefined ){
				jwt.sign({logger}, process.env.API_KEY, {expiresIn: '30m'}, (err, token) => {
					res.json(checkAndChange(
						{
						logger,
						token
						}))
				})
			}else{
				res.json(checkAndChange(logger))
			}
		})

	UsersRouter.route('/users/createpro')
		.post(async (req,res) => {
			let userCreated = await Users.createUserPro(req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.birthday)
			res.json(checkAndChange(userCreated))
		})

	UsersRouter.route('/users/password/:id')
		.put(async (req, res) => {
			let updatedPwd = await Users.updatePwd(req.params.id, req.body.password)
			res.json(checkAndChange(updatedPwd))
		})

/////////////////////////////subscriptions////////////////////////////////////
	UsersRouter.route('/subscriptions/:id')
		.get(verifyToken, async (req,res) => {// get subscriptions by id
			let subscription = await Subscriptions.getByID( req.params.id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(subscription))
				}
			})
		})
		.put(verifyToken, async (req, res) => {
			let subscription = await Subscriptions.update( req.params.id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(subscription))
				}
			})
		})


	UsersRouter.route('/user/subscriptions/:user_id')
		.get(verifyToken, async (req,res) => {// get subscriptions by id
			let subscription = await Subscriptions.getUserSubscription( req.params.user_id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(subscription))
				}
			})
		})

	UsersRouter.route('/user/abonnements/:user_id')
		.get(verifyToken, async (req,res) => {// get subscriptions by id
			let abonnement = await Subscriptions.getUserAbonnement( req.params.user_id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(abonnement))
				}
			})
		})
		.delete(verifyToken, async (req,res) => {
			let subscription = await Subscriptions.delete(req.params.user_id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(subscription))
				}
			})
		})

	UsersRouter.route('/subscriptions/create')
		.post(async (req,res) => {
			let subscriptionsCreated = await Subscriptions.createSubscription(req.body.subscription_type, req.body.user_id)
			res.json(checkAndChange(subscriptionsCreated))
			/*jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(subscriptionsCreated))
				}
			})*/
		})

/////////////////////////////ticket////////////////////////////////////
	UsersRouter.route('/ticket/create')
		.post(verifyToken, async (req, res) => {
			let ticket = await Ticket.createTicket(req.body.name, req.body.id_user, req.body.user_name, req.body.type, req.body.description, req.body.location)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(ticket))
				}
			})
		})

	UsersRouter.route('/tickets/new')		
		.get(verifyToken, async (req, res) => {
			let tickets = await Ticket.getNewTicket(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(tickets))
				}
			})
		})

	UsersRouter.route('/tickets/client/new/:id')		
		.get(verifyToken, async (req, res) => {
			let tickets = await Ticket.getClientNewTicket(req.params.id,req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(tickets))
				}
			})
		})

/////////////////////////////abonnement////////////////////////////////////
	UsersRouter.route('/abonnement')
		.get(verifyToken, async (req,res) => {
			let abonnements = await Abonnement.getAll(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(abonnements))
				}
			})
		})

	UsersRouter.route('/abonnement/:id')
		.get(verifyToken, async (req,res) => {
			let abonnement = await Abonnement.getByID(req.params.id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(abonnement))
				}
			})
		})
		.put(verifyToken, async (req,res) => {
			let abonnement = await Abonnement.update(req.params.id, req.body.name, req.body.price, req.body.commitment)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(abonnement))
				}
			})
		})

	UsersRouter.route('/abonnement/create')
		.post(verifyToken, async (req, res) => {
			let abonnement = await Abonnement.createAbonnement(req.body.name, req.body.price, req.body.commitment)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(abonnement))
				}
			})
		})

	UsersRouter.route('/abonnement/charge')
		.post(verifyToken, async (req, res) => {
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					stripe.customers.create({
						email: req.body.token.email,
						source: req.body.token.id
					})
					.then(customer => stripe.charges.create({
						amount: req.body.amount*100,
						description: req.body.description,
						currency:'eur',
						customer:customer.id
					}))
					.then(charge => res.json(checkAndChange(true)))
				}
			})
		})
/////////////////////////////open_space////////////////////////////////////
	UsersRouter.route('/open_space')
		.get(verifyToken, async (req,res) => {
			let All = await OpenSapce.getAll(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(All))
				}
			})
		})

	UsersRouter.route('/open_space/:id')
		.get(verifyToken, async (req, res) => {// get open_space by id
			let opensSapce = await OpenSapce.getByID( req.params.id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(opensSapce))
				}
			})
		})
		.delete(verifyToken, async (req, res) => {// delete open_space by id
			let opensSapce = await OpenSapce.delete( req.params.id )
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(opensSapce))
				}
			})
		})
		.put(verifyToken, async (req, res) => {
			let openSpace = await OpenSapce.update(req.params.id, req.body.location , req.body.wifi, req.body.drink, req.body.plateau_repas, req.body.conf_room, req.body.call_room, req.body.cosy_room, req.body.printers, req.body.laptops, req.body.schedule_mt_s, req.body.schedule_mt_e, req.body.schedule_f_s, req.body.schedule_f_e, req.body.schedule_we_s, req.body.schedule_we_e, req.body.adresse)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(openSpace))
				}
			})
		})

	UsersRouter.route('/open_space/create')
		.post(verifyToken, async (req,res) => {// create an open_space
			let opensSapce = await OpenSapce.createOpenSpace(req.body.location, req.body.wifi, req.body.drink, req.body.plateau_repas, req.body.conf_room, req.body.call_room, req.body.cosy_room, req.body.printers, req.body.laptops, req.body.schedule_mt_s, req.body.schedule_mt_e, req.body.schedule_f_s, req.body.schedule_f_e, req.body.schedule_we_s, req.body.schedule_we_e, req.body.adresse)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(opensSapce))
				}
			})
		})

/////////////////////////////reservation////////////////////////////////////
	UsersRouter.route('/reservation')
		.get(verifyToken, async (req,res) => {
			let reservation = await Reservation.getAll(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(reservation))
				}
			})
		})

	UsersRouter.route('/user/reservation/:id_user')
		.get(verifyToken, async (req,res) => {
			let reservations = await Reservation.getUserReservations(req.params.id_user)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(reservations))
				}
			})
		})

	UsersRouter.route('/user/borrowing/:id_user')
		.get(verifyToken, async (req,res) => {
			let borrowings = await Reservation.getUserBorrowings(req.params.id_user)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(borrowings))
				}
			})
		})

	UsersRouter.route('/openspace/reservation/:location')
		.get(verifyToken, async (req,res) => {
			let reservations = await Reservation.getOpenspaceReservations(req.params.location)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(reservations))
				}
			})
		})

	UsersRouter.route('/openspace/borrowing/:location')
		.get(verifyToken, async (req,res) => {
			let borrowings = await Reservation.getOpenspaceBorrowings(req.params.location)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(borrowings))
				}
			})
		})

	UsersRouter.route('/reservation/:id')
		.get(verifyToken, async (req,res) => {
			let reservation = await Reservation.getByID(req.params.id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(reservation))
				}
			})
		})
		.delete(verifyToken, async (req,res) => {
			let reservation = await Reservation.delete(req.params.id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(reservation))
				}
			})

		})

	UsersRouter.route('/reservation/create')
		.post(verifyToken, async (req,res) => {
			let reservation = await Reservation.createReservation(req.body.location, req.body.type, req.body.start, req.body.end, req.body.date_res, req.body.number, req.body.id_user)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(reservation))
				}
			})
		})

/////////////////////////////orders////////////////////////////////////
	UsersRouter.route('/orders')
		.get(verifyToken, async (req,res) => {
			let order = await Orders.getAll(req.query.max)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(order))
				}
			})
		})

	UsersRouter.route('/user/order/:user_id')
		.get(verifyToken, async (req,res) => {
			let order = await Orders.getUserOrders(req.params.user_id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(order))
				}
			})
		})

	UsersRouter.route('/openspace/orders/:location')
		.get(verifyToken, async (req,res) => {
			let orders = await Orders.getOpenspaceOrders(req.params.location)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(orders))
				}
			})
		})



	UsersRouter.route('/orders/:id')
		.get(verifyToken, async (req,res) => {
			let order = await Orders.getByID(req.params.id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(order))
				}
			})
		})
		.delete(verifyToken, async (req,res) => {
			let order = await Orders.delete(req.params.id)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(order))
				}
			})
		})

	UsersRouter.route('/orders/create')
		.post(verifyToken, async (req,res) => {
			let order = await Orders.createOrder(req.body.location, req.body.date_order, req.body.user_id, req.body.count, req.body.time)
			jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
				if(err){
					res.sendStatus(403)
				}else{
					res.json(checkAndChange(order))
				}
			})
		})

/////////////////////////////mails////////////////////////////////////
	UsersRouter.route('/send/mail')
		.post(async (req, res) => {
			let mail = await Mail.sendMail(req.body.destination,req.body.subject,req.body.message)
			res.json(checkAndChange(mail))
		})

	function verifyToken(req, res, next){
		const bearerHeader = req.headers['authorization']
		if(typeof bearerHeader !== 'undefined'){
			const bearer = bearerHeader.split(' ')
			const bearerToken = bearer[1]
			req.token = bearerToken
			next();
		}else{
			res.sendStatus(403)
			//res.json({message:'need authorization'})
		}
	}
	app.use(config.rootAPI, UsersRouter)
	app.listen(config.port, () => console.log('started on port '+config.port+'.'))
}).catch((err)=> {
	console.log('Error during database connection')
	console.log(err.message)
})
