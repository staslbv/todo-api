var _      = require('underscore');
var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes){

	var dbuser = sequelize.define('users',{
		email:{
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				len: [1,250],
				isEmail:true
			},
			unique: true
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING

		},
		password:{
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate:{
				len: [6,250]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value,salt);

				this.setDataValue('password',value);
				this.setDataValue('salt',salt);
				this.setDataValue('password_hash',hashedPassword);
			}
		}
	},{
		hooks:
		{
			beforeValidate: function(user,options){
				if (typeof user.email == 'string')
					user.email = user.email.toLowerCase();
			}
		},
		instanceMethods:{
			toPublicJSON: function(){
				var value = this.toJSON();
				return _.pick(value,'id','email','createdAt','updatedAt');
			}
		},
		classMethods:{
			authenticate: function(body)
			{
				return new Promise(function(resolve,reject){
					if (typeof body.password != 'string' || typeof body.email != 'string')
						return reject();
					console.log('finding user: ' + body.email);
					dbuser.findOne({where:{email: body.email}}).then(function(u){
						if (!u)
							return reject();
						var _pass = bcrypt.hashSync(body.password, u.get('salt'));
						if (_pass == u.get('password_hash')){
							resolve(u);
						}else{
							reject('401');
						}
					}).catch(function(e){
						console.log(e);
						reject(e);
					});
				});
			}
		}
	} );
return dbuser;
};
