module.exports = function(sequelize, DataTypes){
	return sequelize.define('users',{
		email:{
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				len: [1,250],
				isEmail:true
			},
			unique: true
		},
		password:{
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				len: [6,250]
			}
		}
	},{
		hooks:{
			beforeValidate: function(user,options){
				if (typeof user.email == 'string')
					user.email = user.email.toLowerCase();
			}
		}
	});
};
