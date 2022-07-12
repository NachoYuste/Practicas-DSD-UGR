var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var socketio = require("socket.io");
var MongoClient = require('mongodb').MongoClient;
var MongoServer = require('mongodb').Server;


var mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};
var httpServer = http.createServer(
    function(request, response){
        var uri = url.parse(request.url).pathname;
		if (uri=="/") uri = "/cliente.html";
		var fname = path.join(process.cwd(), uri);

        fs.exists(fname, function(exists){
            if(exists){
                fs.readFile(fname, function(err, data){
                    if(!err){
                        var extension = path.extname(fname).split(".")[1];
                        var mimeType = mimeTypes[extension];

                        response.writeHead(200, mimeType);
                        response.write(data);
                        response.end();
                    }

                });
            }
            else{
                console.log("Peticion invalida: "+uri);
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write('404 Not Found\n');
				response.end();
            }
        });
    }
);


var estadoLuz = "encendido";
var estadoPersiana = "abierto";
var estadoAC = "encendido"
var estadoPuerta = "dentro";

const horaNoche = (new Date('2022-05-23 20:00:00')).getHours();
const horaDia = (new Date('2022-05-23 07:00:00')).getHours();

MongoClient.connect("mongodb://localhost:27017/casaDomotica",{ useUnifiedTopology: true }, function(err, db) {
    httpServer.listen(8080);
    var io = socketio(httpServer);

    var dbo = db.db("casaDomotica");

    dbo.createCollection("sensores", function(err, collection){
        
        io.sockets.on('connection', function(client) {
            
            //"Poner" -> sensores publican datos
			client.on('poner', function (data) {
				collection.insertOne(data, {safe:true}, function(err, result) {});
			
                //Actualizamos los datos de los clientes

                io.sockets.emit('actualizar',
                                "temperatura: " + data.temperatura +
                                ", luminosidad: " + data.luminosidad +
                                ", " + data.puerta +
                                ", hora: " + data.time
                );
                
                io.sockets.emit('actualizar_temp', data.temperatura);
                io.sockets.emit('actualizar_luz', data.luminosidad);
                io.sockets.emit('actualizar_puerta', data.puerta);
			});

            //"Obtener" -> los clientes piden los datos
			client.on('obtener', function (data) {
				collection.find().sort({_id:-1}).limit(1).forEach(function(result){
                    client.emit('actualizar',
                                "temperatura: " + data.temperatura +
                                ", luminosidad: " + data.luminosidad +
                                ", " + data.puerta +
                                ", hora: " + data.time
                    );
                });
			});

            //"obtener_temp" -> cliente pide la temperatura
            client.on('obtener_temp', function() {
				collection.find().sort({_id:-1}).limit(1).forEach(function(result){
					client.emit('actualizar_temp',result.temperatura);
				});
			});

            //"obtener_luz" -> cliente pide la luminosidad
            client.on('obtener_luz', function() {
				collection.find().sort({_id:-1}).limit(1).forEach(function(result){
					client.emit('actualizar_luz',result.luminosidad);
				});
			});

            //"obtener_puerta" -> cliente consulta si hay gente dentro
            client.on('obtener_puerta', function(){
                collection.find().sort({_id:-1}).limit(1).forEach(function(result){
                    client.emit('actualizar_puerta', result.puerta);
                });
            })


            //"cambiar_estado_persiana" -> abre o cierra la persina
			client.on('cambiar_estado_persiana', function(){
				if (estadoPersiana == "abierto")
                    estadoPersiana = "cerrado";
				else
                    estadoPersiana = "abierto";

				// Se notifica el nuevo estado a todos los clientes
				io.sockets.emit('actualizar_estado_persiana', estadoPersiana);
				console.log("Persiana: " + estadoPersiana);
			});

            //"cambiar_estado_ac" -> enciende o apaga el aire acondicionado
			client.on('cambiar_estado_ac', function(){
				if (estadoAC == 'activo')
					estadoAC = 'apagado';
				else
					estadoAC = 'activo';

				// Se notifica el nuevo estado a todos los clientes
				io.sockets.emit('actualizar_estado_ac', estadoAC);
                console.log("A/C: " + estadoAC)
			});

            //"cambiar_estado_luz" -> enciende o apaga la luz
            client.on('cambiar_estado_luz', function() {
                if(estadoLuz == "apagado")
                    estadoLuz = "encendido";
                else
                    estadoLuz = "apagado";

                // Se notifica el nuevo estado a todos los clientes
				io.sockets.emit('actualizar_estado_luz', estadoLuz);
				console.log("Luz: " + estadoLuz);
            });

            //"cambiar_estado_puerta" -> marca si hay alguien dentro o fuera de casa
            client.on('cambiar_estado_puerta', function() {
                if(estadoPuerta == "dentro")
                    estadoPuerta = "fuera";
                else
                    estadoPuerta = "dentro";

                // Se notifica el nuevo estado a todos los clientes
				io.sockets.emit('actualizar_estado_puerta', estadoPuerta);
				console.log("Personas: " + estadoPuerta);
            });

            client.on('obtener_estado_persiana', function(){
				client.emit('obt_estado_persiana', estadoPersiana);
			});

            client.on('obtener_estado_luz', function(){
                client.emit('obt_estado_luz', estadoLuz);
            });

            client.on('obtener_estado_ac', function(){
				client.emit('obt_estado_ac', estadoAC);
			});

            client.on('obtener_estado_puerta', function(){
                client.emit('obt_estado_puerta', estadoPuerta);
            });
         

            //Alerta para cuando baja de cierto nivel de luminosidad
            //Si es de noche se encienden las luces, si es de día se abre la persianas
            //Si no hay nadie en la casa no se encienden las luces ni se abren las persianas
            client.on('alerta_luz_baja', function(data){
                var horaActual = (new Date()).getHours();
                
                if(estadoPuerta == "dentro"){
                    if (horaActual >= horaNoche && horaActual <= horaDia){
                        estadoLuz = "encendido";
                        io.sockets.emit('actualizar_estado_luz', estadoLuz);
                    }
                    else{
                        estadoLuz = "apagado";
                        estadoPersiana = "abierta"
                        io.sockets.emit('actualizar_estado_luz', estadoLuz);
                        io.sockets.emit('actualizar_estado_persiana', estadoPersiana)
                    }
                }
                io.sockets.emit('actualizar_advertencia_lum', data);
            });


            //Alerta para cuando se supera cierto nivel de luminosidad
            //Si es de día no se encienden las luces, pero se cierran las persianas
            //Si es de noche sólo se cierran las persianas.
            client.on('alerta_luz_alta', function(data){

                var horaActual = (new Date()).getHours();

                if(horaActual <= horaNoche && horaActual >= horaDia){
                    estadoLuz = "apagado";
                    estadoPersiana = "cerrado";
                    io.sockets.emit('actualizar_estado_persiana', estadoPersiana);
                    io.sockets.emit('actualizar_estado_luz', estadoLuz); 
                }
                else{
                    estadoPersiana = "cerrado";
                    io.sockets.emit('actualizar_estado_persiana', estadoPersiana);
                }
                
                io.sockets.emit('actualizar_advertencia_lum', data);
            });

            //Alerta para cuando baja de cierta temperatura
            //Apaga el AC
            //Si es de día abrimos abrimos las persiamas para subir la temperatura
            client.on('alerta_temp_baja', function(data){

                horaActual = (new Date()).getHours();

                if(horaActual <= horaNoche && horaActual >= horaDia){
                    estadoPersiana = "abierto";
                    io.sockets.emit('actualizar_estado_persiana', estadoPersiana);
                }
                
                estadoAC = "apagado";
                io.sockets.emit('actualizar_estado_ac', estadoAC);
                io.sockets.emit('actualizar_advertencia_temp', data);
            });

            //Alerta para cuando se supera cierta temperatura
            //Si es de día cerramos las persianas para bajar temp
            //Si hay gente en la casa ponemos el aire
            client.on('alerta_temp_alta', function(data){
                horaActual = (new Date()).getHours();
                
                if(horaActual <= horaNoche && horaActual >= horaDia){
                    estadoPersiana = "cerrado";
                    io.sockets.emit('actualizar_estado_persiana', estadoPersiana);
                }
                
                if(estadoPuerta == "dentro"){
                    estadoAC = "encendido";
                    io.sockets.emit('actualizar_estado_ac', estadoAC);
                }
                else{
                    estadoAC = "apagado";
                    io.sockets.emit('actualizar_estado_ac', estadoAC);
                }
                io.sockets.emit('actualizar_advertencia_temp', data);
            });

            //Alerta para cuando entra/sale gente
            client.on('alerta_puerta', function(data){
                estadoPuerta = data;
                io.sockets.emit('actualizar_estado_puerta', estadoPuerta);
            });
            
		});
    });
});

console.log("Servicio MongoDB iniciado");

