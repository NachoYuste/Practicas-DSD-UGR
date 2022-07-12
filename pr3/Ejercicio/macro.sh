#!/bin/sh -e

echo
echo "Lanzando servidor 1..."
java -Djava.security.policy=./ServidorUno/build/classes/servidor/server.policy -jar ./ServidorUno/dist/ServidorUno.jar server1 server2 &

sleep 2 

echo
echo "Lanzando servidor 2..."
java -Djava.security.policy=./ServidorDos/build/classes/servidordos/server.policy -jar ./ServidorDos/dist/ServidorDos.jar server2 server1 &

sleep 2 

echo
echo "Ejecutando cliente..."
java -Djava.security.policy=./Cliente/build/classes/cliente/client.policy -jar ./Cliente/dist/Cliente.jar server1


#Línea para terminar completamente los servidores para poder volver a ejecutar el 
#macro con normalidad
echo
echo "Terminando servidores..."
lsof -ti:1099 | xargs kill -9

