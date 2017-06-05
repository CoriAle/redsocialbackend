'use strict'

var express= require('express');
var UsuarioController =require('../controllers/usuario'); 
var PublicacionController = require('../controllers/publicacion');
var api=express.Router();

var multipart=require('connect-multiparty');//es para poder suir por partes una imagen
var multipartMiddleware = multipart({uploadDir: './uploads'});

api.get('/usuario/:id', UsuarioController.getUsuario);	//de primero va la ruta y luego va el identificador
														//las operaciones se deben ejecutar sobre esa ruta 
api.get('/usuarios', UsuarioController.getUsuarios);
api.post('/usuario', UsuarioController.saveUsuarios);
api.post('/login', UsuarioController.postLogin);
api.put('/usuario/:id', UsuarioController.updateUsuario);
api.delete('/usuario/:id', UsuarioController.deleteUsuario);
api.post('/upload-image-perfil/:id',multipartMiddleware, UsuarioController.uploadPerfil);//suir foto perfil
api.post('/upload-portada/:id',multipartMiddleware, UsuarioController.uploadPortada);//subir foto portada

api.get('/publicacion/:id', PublicacionController.getPublicacion);
api.get('/publicaciones', PublicacionController.getPublicacionesTodas);
api.post('/publicacion', PublicacionController.savePublicaciones);
api.post('/publicacioncon',multipartMiddleware, PublicacionController.savePublicacionesCon);
api.put('/publicacion/:id', PublicacionController.uploadFotos);
api.post('/upload-image/:id',multipartMiddleware, PublicacionController.uploadFotos);
api.delete('/publicacion/:id', PublicacionController.deletePublicacion);
api.get('/get-image/:foto', PublicacionController.retornarFotos);
api.post('/comentario/:id', PublicacionController.NuevoComentario);


module.exports=api;