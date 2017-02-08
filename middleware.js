var cryptojs = require('crypto-js');

module.exports = function(db){
	return {
		requireAuthentication: function(req,res,next){
			var token = req.get('Auth');
			
			if (typeof token != 'string')
				token = '';

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			})
			.then(function (tokenInstance){
				if (!tokenInstance){
					console.log('no token instance ...');
					throw new Error();
				}
				req.token = tokenInstance;
				return db.users.findByToken(token);
			})
			.then(function(user){

				req.user = user;
				next();
			})
			.catch(function(e){

				console.log('error: ' + JSON.stringify(e));
				
				res.status(401).send();
			});
		}
	};
};