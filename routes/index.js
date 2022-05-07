const userRoutes = require('./doctor_public');
const privateRoutes = require('./reviews');

const constructorMethod = (app) => {
	app.use('/', userRoutes);
	app.use('/private', privateRoutes);

	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;