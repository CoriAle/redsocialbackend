'uses strict'

var mongoose=require('mongoose'), Schema = mongoose.Schema,
bcrypt = require('bcrypt'), SALT_WORK_FACTOR = 10,
MAX_LOGIN_ATTEMPTS = 10, LOCK_TIME = 2;//60*60*1000;
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
	nombre: {type:String, required:true, index:{unique:true}},	
	password:{type:String, required:true},
	correo:{type:String, required:true},
	fechaUnion: {type:Date, default:Date.now},
	descripcion:String,
	cumpleanios:Date,
	fotoperfil:String,
	fotoportada:String,
	loginAttemps:{type:Number, required:true, default:0},
	lockUntil: { type:Number}
});


UsuarioSchema.pre('save', function(next)
{
	var user= this;
	if(!user.isModified('password')) 
		return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt)
	{
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash)
		{
			if(err) return next(err);
			user.password=hash;
			next();
		});
	});
});
UsuarioSchema.methods.comparePassword = function(candidatePassword, cb)
{
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch)
	{
		if(err) return cb(err);
		cb(null, isMatch);
	});
};
module.exports = mongoose.model('Usuario',UsuarioSchema);
//lo primero será el nombre del modelo y de allí el nombre del esquema