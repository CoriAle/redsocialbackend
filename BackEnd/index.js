'use strict'



//toda la información para generar el server
var mongoose=require('mongoose');//instanciamos mongoose
var app = require('./app');
var port = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/redsocial',(err,res)=>{
	if(err)
	{
		throw err;
	}
	else
	{
		console.log('Conexión a MongoDB');
		app.listen(port, function()
		{
	console.log( 'Aplicacion funcionando correctamente');
		});
	}

});

