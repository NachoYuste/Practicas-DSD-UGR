var serviceURL = 'localhost:8080';
var socket = io.connect(serviceURL);
var luz_max = 50;
var luz_min = 15;
var luz_actual = 0;
var temp_max = 35;
var temp_min = 15;
var temp_actual = 25;
var estado_puerta = '';

socket.on('actualizar_luz', function(data){
    luz_actual = data;

    if(luz_actual > luz_max){
        socket.emit('alerta_luz_alta', luz_actual);
    }
    else if(luz_actual < luz_min){
        socket.emit('alerta_luz_baja', luz_actual);
    }
});

socket.on('actualizar_temp', function(data){
    temp_actual = data;

    if(temp_actual > temp_max){
        socket.emit('alerta_temp_alta', temp_actual);
    }
    else if(temp_actual < temp_min){
        socket.emit('alerta_temp_baja', temp_actual);
    }
});

socket.on('actualizar_puerta', function(data){
    estado_puerta = data;
    socket.emit('alerta_puerta', estado_puerta);
})

socket.emit('obtener_temp');
socket.emit('obtener_luz');
socket.emit('obtener_puerta');