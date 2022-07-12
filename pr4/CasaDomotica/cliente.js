function actualizarLista(datos){
    var elementos = document.getElementById('listaEventos');
    var item = document.createElement('li');
    item.innerHTML = datos;
    elementos.appendChild(item);
}

function enviar_sensores() {
    var temp = document.getElementById("temperatura").value;
    var lum = document.getElementById("luminosidad").value;
    var puer = document.getElementById("puerta");
    var spuer = "";
    
    if(puer.checked)    spuer = "dentro";
    else                spuer = "fuera";

    var serviceURL = 'localhost:8080';
    var socket = io.connect(serviceURL);
    var d = (new Date()).getHours() +":"+(new Date()).getMinutes();
    
    socket.emit('poner', {temperatura:temp, luminosidad:lum, puerta:spuer, time:d});
}

var socket = io.connect('localhost:8080');

socket.emit('obtener');

socket.on('actualizar', function(data){
    actualizarLista(data);
    document.getElementById('advertencia_luz').innerHTML = '';
    document.getElementById('advertencia_temp').innerHTML = '';
})

socket.on('actualizar_estado_persiana', function(data){
    var estado_persiana = document.getElementById('estadoPersiana');
    estado_persiana.innerHTML = data;
});

socket.on('actualizar_estado_ac', function(data){
    var estado_ac = document.getElementById('estadoAC');
    estado_ac.innerHTML = data;
});

socket.on('actualizar_estado_luz', function(data){
    var estado_luz = document.getElementById('estadoLuz');
    estado_luz.innerHTML = data;
});

socket.on('actualizar_estado_puerta', function(data){
    var estado_puerta = document.getElementById('estadoPuerta');
    estado_puerta.innerHTML = data;
});

socket.on('obt_estado_persiana', function(data){
    var estado_persiana = document.getElementById('estadoPersiana');
    estado_persiana.innerHTML = data;
});

socket.on('obt_estado_ac', function(data){
    var estado_ac = document.getElementById('estadoAC');
    estado_ac.innerHTML = data;
});

socket.on('obt_estado_luz', function(data){
    var estado_luz = document.getElementById('estadoLuz');
    estado_luz.innerHTML = data;
});

socket.on('obt_estado_puerta', function(data){
    var estado_puerta = document.getElementById('estadoPuerta');
    estado_puerta.innerHTML = data;
})

socket.emit('obtener_estado_persiana');
socket.emit('obtener_estado_ac');
socket.emit('obtener_estado_luz');
socket.emit('obtener_estado_puerta');

var boton_persiana = document.getElementById('cambiar_estado_persiana');
boton_persiana.onclick = function(){
    socket.emit('cambiar_estado_persiana');
}

var boton_ac = document.getElementById('cambiar_estado_ac');
boton_ac.onclick = function(){
    socket.emit('cambiar_estado_ac');
}

var boton_luz = document.getElementById('cambiar_estado_luz');
boton_luz.onclick = function(){
    socket.emit('cambiar_estado_luz');
}

var boton_puerta = document.getElementById('cambiar_estado_puerta');
boton_puerta.onclick = function(){
    socket.emit('cambiar_estado_puerta');
}

socket.on('actualizar_advertencia_lum', function(data){

    if(data >= 50){
        document.getElementById('advertencia_luz').innerHTML = "Advertencia: " + 
        " La luminosidad ha sobrepasado el valor máximo. Ahora es: " + data;
    }
    else if(data <=15){
        document.getElementById('advertencia_luz').innerHTML = "Advertencia: " + 
        " La luminosidad está por debajo del valor mínimo. Ahora es: " + data;
    }
    else{
        document.getElementById('advertencia_luz').innerHTML = "";
    }

});

socket.on('actualizar_advertencia_temp', function(data){

    if(data >= 35){
        document.getElementById('advertencia_temp').innerHTML = "Advertencia: " + 
        " La temperatura ha sobrepasado el valor máximo. Ahora es: " + data;
    }
    else if(data <=15){
        document.getElementById('advertencia_luz').innerHTML = "Advertencia: " + 
        " La temperatura está por debajo del valor mínimo. Ahora es: " + data;
    }
    else{
        document.getElementById('advertencia_temp').innerHTML = "";
    }
});

socket.on