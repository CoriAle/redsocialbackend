'use strict'

var path=require('path');//vamos a sacar la ruta donde lo vamos a guardar
var Publicacion = require('../models/publicacion');
var Usuario = require ('../models/usuario');
//busco una publicación en específico
function getPublicacion(req, res){
	var publicacionId = req.params.id;
	Publicacion.findById(publicacionId, function(err,publicacion)
	{
		if(err)
		{
			res.status(202).send({message: 'Error en la petición'});
		}
		else 
		{
			if(!publicacion)
			{
				res.status(204).send({message:'No se encontró la publicación'});
			}
			else
			{
				Usuario.populate(publicacion, {path:'usuariocreador'}, (err, publicacion)=>
				{
					if(err)
					{
						res.status(202).send({message: 'Error en el proceso'});
					}
					else
					{
						res.status(200).send({publicacion});
					}
				});
			}
		}
	});
}

//Todas las publicaciones con los usuarios
function getPublicacionesTodas(req, res){
	Publicacion.find({}).sort('-fechapublicacion').exec((err,publicaciones)=>//acá está ordenando a través del id
		{
			if(err)
			{
				res.status(202).send({message: 'Error al devolver los marcadores'});
			}
			else
			{

				if(!publicaciones)
				{
					res.status(204).send({message:'No hay marcadores'});
				}
				else
				{
					Usuario.populate(publicaciones,{path:'usuariocreador'},(err,publicaciones)=>{
						if(err)
						{
							res.status(202).send({message:'No hay publicaciones'});
						}
						else
						{
							Usuario.populate(publicaciones, {path:'comentario.nombre'},(err,publicaciones)=>
							{
								if(err)
								{
									res.status(202).send({message:'error de ejecución'});
								}
								else
								{
									res.status(200).send({publicaciones});
								}
							});
						}
					});
				}
			}
		});
}

//creo una publicación

function savePublicaciones(req, res){
	var publicar = new Publicacion();
	var params= req.body;
	publicar.usuariocreador = params.id;
	publicar.contenido = params.contenido;

	publicar.save((err, publicacionStored)=> 
	{
		if(err)
		{
			res.status(202).send({message: 'Error al guardar el marcador Usuario'});
		}
		else
		{
			if(!publicacionStored)
			{
				res.status(204).send({message:'No se ha guardado la publicación'});
			}
			else
			{
			res.status(200).send({publicar: publicar});
			}	
		}
	}); 
}


function savePublicacionesCon(req, res)
{
	if(req.files)//con esto para ficheros entrados por http
	{
		var file_path = req.files.image.path; //el nombre de donde se va a cargar la imagen será image
		var file_split = file_path.split('\\');
		var file_name = file_split[1];
		var publicar = new Publicacion();
	publicar={"usuariocreador":req.body.usuariocreador,"contenido":req.body.contenido,"foto":file_name};
	publicar.save((err, publicacionStored)=> 
	{
		if(err)
		{
			res.status(202).send({message: 'Error al guardar el marcador Usuario'});
		}
		else
		{
			if(!publicacionStored)
			{
				res.status(204).send({message:'No se ha guardado la publicación'});
			}
			else
			{
			res.status(200).send({publicar: publicacionStored});				
			}	
		}
	});
	}
}






//genera un nuevo comentario con imagen
function NuevoComentario(req, res)
{
	var publicacionId=req.params.id;
	var comentario={"nombre":req.body.nombre,"contenido":req.body.contenido};
	Publicacion.findByIdAndUpdate(publicacionId,{$push:{comentario:comentario}},(err,nuevoComentario)=>
		{
			if(err)
			{
				res.status(202).send({message:'Error al crear comentario'});
			}
			else
			{
				if(!nuevoComentario)
				{
					res.status(204).send({message:'No se esta creando ningún comentario'});
				}
				else
				{
					res.status(200).send({Creado: nuevoComentario});
				}
			}
		});
}

//generará un comentario sin imagen

function NuevoComentarioFoto(req, res)
{
	var publicacionId=req.params.id;
	if(req.files)//con esto para ficheros entrados por http
	{
		var file_path = req.files.image.path; //el nombre de donde se va a cargar la imagen será image
		var file_split = file_path.split('\\');
		var file_name = file_split[1];
	
	var comentario={"nombre":req.body.nombre,"contenido":req.body.contenido,"foto":file_name};
	Publicacion.findByIdAndUpdate(publicacionId,{$push:{comentario:comentario}},(err,nuevapublicacion)=>
		{
			if(err)
			{
				res.status(202).send({message:'Error al crear comentario'});
			}
			else
			{
				if(!nuevoComentario)
				{
					res.status(204).send({message:'No se esta creando ningún comentario'});
				}
				else
				{
					res.status(200).send({Creado: nuevoComentario});
				}
			}
		});
	}
}




//con este método servirá para subir imágenes al servidor
function uploadFotos(req, res)
{
	var comentarioId=req.params.id;
	var filename='No subido..';

	if(req.files!=={})//con esto para ficheros entrados por http
	{
		
		var file_path = req.files.image.path; //el nombre de donde se va a cargar la imagen será image
		var file_split = file_path.split('\\');
		var file_name = file_split[1];
		
		Publicacion.findByIdAndUpdate(comentarioId, {foto:file_name}, (err, publicacionUpdate)=>
		{
			if(err)
			{
				res.status(202).send({message: 'Error en la petición'});
			}
			else
			{
				if(!publicacionUpdate)
				{
					res.status(204).send({message:'No se ha actualizado la publicación'});
				}
				else
				{
				res.status(500).send({actualizado:publicacionUpdate});				
				}	
			}
		});
	}
	else
	{
		res.status(204).send({message:'No se pudo subir la imagen'});
	}
	
}

//getImage
var fs= require('fs');
function retornarFotos(req, res)
{
	var fotoFile=req.params.foto;
	fs.exists('./uploads/'+fotoFile,function(exists)
	{
		if(exists)
		{
			res.sendFile(path.resolve('./uploads/'+fotoFile));			
		}
		else
		{
			res.status(204).send({message:'No existe la imagen'});
		}
	});
}

//acá puedo eliminar una publicación
function deletePublicacion(req, res) {
	var publicacionId = req.params.id;
	Publicacion.findById(publicacionId, function(err,usuario)// Acá estamos buscando por un Id
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


module.exports = {
	getPublicacion,
	getPublicacionesTodas,
	NuevoComentario,
	savePublicacionesCon,
	uploadFotos, 
	retornarFotos,
	savePublicaciones,
	deletePublicacion
}