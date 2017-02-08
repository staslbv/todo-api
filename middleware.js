module.exports = function(db){
	return {
		requireAuthentication: function(req,res,next){
			var token = req.get('Auth');

			db.users.findByToken(token).then(function(user){
				req.user = user;
				next();
			}).catch(function(e){
				res.status(401).json(e).send();
			});

		}

	};

};