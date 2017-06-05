'use strict'

var path=require('path');
var Usuario = require('../models/usuario');
var Publicacion=require('../models/publicacion');
function postLogin(req, res)
{
	var usuario=req.body.correo;
	var password=req.body.pass;

		Usuario.findOne({correo:usuario}, function(err, usuario)
		{
			if(err)
			{
				console.log('no se encontro ningn correo');
				res.status(202).send({message: 'Error en ejecusión'});
			}
			if(!usuario)
				{ res.status(204).send({message:'No se encontró el correo'});}
			else
			usuario.comparePassword(password,function(err, isMatch)
			{
				if(err)
				{

						res.status(202).send({message: 'Error en contraseña y correo'});
				}
				else
				{
					if(!isMatch)
					{
						res.status(204).send({message:'No es la combinación'});
					}
					else
					{
						res.status(200).send({usuario});
					}
				}
			});
		});
}

function getUsuario(req, res){
	var usuarioId = req.params.id;
	Usuario.findById(usuarioId, function(err,usuario)// Acá estamos buscando por un Id
	{
		if(err)
		{
			res.status(202).send({message: 'No se ha podido realizar la operacion'});
		}
		else
		{
			if(!usuario)
			{
				res.status(204).send({message:'No hay marcador'});
			}
			else
			{
			res.status(200).send({usuario});
			}
		}
	});
}


function getUsuarios(req, res){
	Usuario.find({}).sort('-id').exec((err,usuarios)=>//acá está ordenando a través del id
		{
			if(err)
			{
				res.status(202).send({message: 'Error al devolver los marcadores'});
			}
			else
			{

				if(!usuarios)
				{
					res.status(204).send({message:'No hay marcadores'});
				}
				else
				{
				res.status(200).send(usuarios);
				}
			}
		});
}


function saveUsuarios(req, res){
	var usuario = new Usuario();
	var params = req.body;

	usuario.nombre = params.nombre;
	usuario.correo = params.correo;
	usuario.descripcion = params.descripcion;
	usuario.cumpleanios = params.cumpleanios;
	usuario.fotoperfil = "";
	usuario.fotoportada = "";
	usuario.password = params.password;

	usuario.save((err, usuarioStored)=>
	{
		if(err)
		{
			res.status(202).send({message: 'Error al guardar el Usuario'});
		}
		else
		{
			res.status(200).send({usuario: usuarioStored});
		}
	});
}


function updateUsuario(req, res){
	var update = req.body;
	var usuarioId=req.params.id;
	Usuario.findByIdAndUpdate(usuarioId, update, (err, usuarioUpdate)=>
		{
			if(err)
			{
				res.status(202).send({message:'Error al actualizar el marcador'});
			}
			else
			{
				res.status(200).send({usuario : usuarioUpdate});
			}

		});
}


function deleteUsuario(req, res) {
	var usuarioId = req.params.id;
	Usuario.findById(usuarioId, function(err,usuario)// Acá estamos buscando por un Id
	{
		if(err)
		{
			res.status(202).send({message: 'Error al devolver el marcador'});
		}
		if(!usuario)
		{
			res.status(204).send({message:'No hay marcador'});
		}
		else
		{
			usuario.remove(err =>
			{
				if(err)
				{
					res.status(202).send({message: 'Error al borrar'});
				}
				else
				{
					res.status(200).send({message:'El marcador se ha eliminado'})
				}
			});
		}
	});
}
function uploadPerfil(req, res)
{
	var UsuarioId=req.params.id;
	var filename='No subido..';

	if(req.files!=={})//con esto para ficheros entrados por http
	{
		
		var file_path = req.files.image.path; //el nombre de donde se va a cargar la imagen será image
		var file_split = file_path.split('\\');
		var file_name = file_split[1];
		
		Usuario.findByIdAndUpdate(UsuarioId, {fotoperfil:file_name}, (err, usuarioUpdate)=>
		{
			if(err)
			{
				res.status(202).send({message: 'Error en la petición'});
			}
			else
			{
				if(!usuarioUpdate)
				{
					res.status(204).send({message:'No se ha actualizado la publicación'});
				}
				else
				{
				res.status(200).send({actualizado:usuarioUpdate});				
				}	
			}
		});
	}
	else
	{
		res.status(204).send({message:'No se pudo subir la imagen'});
	}
	
}


function uploadPortada(req, res)
{
	var usuarioId=req.params.id;
	var filename='No subido..';

	if(req.files!=={})//con esto para ficheros entrados por http
	{
		
		var file_path = req.files.image.path; //el nombre de donde se va a cargar la imagen será image
		var file_split = file_path.split('\\');
		var file_name = file_split[1];
		
		Usuario.findByIdAndUpdate(usuarioId, {fotoportada:file_name}, (err, usuarioUpdate)=>
		{
			if(err)
			{
				res.status(202).send({message: 'Error en la petición'});
			}
			else
			{
				if(!usuarioUpdate)
				{
					res.status(204).send({message:'No se ha actualizado la publicación'});
				}
				else
				{
				res.status(200).send({actualizado: usuarioUpdate});				
				}	
			}
		});
	}
	else
	{
		res.status(204).send({message:'No se pudo subir la imagen'});
	}
	
}


module.exports = {
	getUsuario,
	postLogin,
	getUsuarios,
	saveUsuarios,
	uploadPerfil,
	uploadPortada,
	updateUsuario,
	deleteUsuario
}
