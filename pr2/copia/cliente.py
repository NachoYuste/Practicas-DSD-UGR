from calculadora import Calculadora

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

def interfazSimple(client):
    print("\n***********************")
    print("* OPERACIONES SIMPLES *")
    print("\n**********************")
    
    
    while True :
        print("Elija la operacion a realizar:\n")
        operacion = input("\tSuma -> +\tResta -> -\t Multiplicacion -> x\t Division -> /\tModulo -> %\tDivision Entera -> |\n")

        if operacion == '+' or operacion == '-' or operacion == 'x' or operacion == '/' or operacion == '%' or operacion == '|' :
            break

    val1 = float(input("Introduzca el primer valor: "))
    val2 = float(input("Introduzca el segundo valor: "))


    if operacion == '+':
       resultado = client.suma(val1, val2)
    elif operacion == '-':
        resultado = client.resta(val1, val2)
    elif operacion == 'x':
        resultado = client.multiplicacion(val1, val2)
    elif operacion == '/':
        resultado = client.division(val1, val2)
    elif operacion == '%':
        resultado = client.modulo(val1, val2)
    elif operacion == '|':
        resultado = client.divisionEntera(val1, val2)

    print(str(val1) + operacion + str(val2) + " = " + str(resultado))


def interfazVectorial(client):
    print("\n***************************")
    print("* OPERACIONES VECTORIALES *")
    print("***************************\n")
    
    while True :
        print("Elija la operacion a realizar:\n")
        operacion = input("\tSuma -> +\tResta -> -\t Multiplicacion -> x\t Division -> /\Maximo -> M\tMinimo -> N|\n")

        if operacion == '+' or operacion == '-' or operacion == 'x' or operacion == '/' or operacion == 'M' or operacion == 'N' :
            break

    vec1 = []

    if(operacion == 'M' or operacion == 'N'):
        print("Introduce los elementos del array uno a uno pulsando enter entre ellos\n")
        print("Introduza 'F' para terminar de introducir\n")
        
        while True:
            valor = input("-> ")

            if(valor == 'F'):
                break
            else:
                vec1.append(float(valor))

    else:
        print("Introduce los elementos del array uno a uno pulsando enter entre ellos\n")
        print("Introduza 'F' para terminar de introducir\n")
        
        while True:
            valor = input("-> ")

            if(valor == 'F'):
                break
            else:
                vec1.append(float(valor))

        print("Introduzca el escalar de la operacion\n")

        esc = float(input("-> "))

    
    if operacion == '+':
       resultado = client.vectorMasEscalar(vec1, esc)
    elif operacion == '-':
        resultado = client.vectorMenosEscalar(vec1, esc)
    elif operacion == 'x':
        resultado = client.vectorPorEscalar(vec1, esc)
    elif operacion == '/':
        resultado = client.vectorEntreEscalar(vec1, esc)
    elif operacion == 'M':
        resultado = client.maximo(vec1)
    elif operacion == 'N':
        resultado = client.minimo(vec1)

    print("Resultado: " +  str(resultado))


def interfazMatricial(client):
    print("\n***************************")
    print("* OPERACIONES MATRICIALES *")
    print("***************************\n")
    
    while True :
        print("Elija la operacion a realizar:\n")
        operacion = input("\Suma de columnas -> C\t Suma de filas -> F\n")

        if operacion == 'C' or operacion == 'F' :
            break

    n = int(input("Introduce la dimension de la matriz cuadrada: "))

    print("Introduce los elementos de la matriz uno a uno pulsando enter entre ellos\n")
    
    fila = []
    matriz = [[]]

    for i in range(n):
        for j in range(n):
            fila.append(float(input("-> ")))
        
        matriz.append(fila)

    if operacion == 'C':
       resultado = client.sumaColumnas(matriz)
    elif operacion == 'F':
        resultado = client.sumaFilas(matriz)

    print("Resultado:\n" + str(resultado))




transport = TSocket.TSocket("localhost", 9090)
transport = TTransport.TBufferedTransport(transport)
protocol = TBinaryProtocol.TBinaryProtocol(transport)

client = Calculadora.Client(protocol)
transport.open()

while True :
    print("Elija la calculadora a utilizar:\n")
    operacion = input("\tSimple -> S\tVector y Escalar -> V\tMatricial -> M: ")

    if operacion == 'S' or operacion == 'V' or operacion == 'M':
        break


if operacion == 'S':
    interfazSimple(client)
elif operacion == 'V':
    interfazVectorial(client)
elif operacion == 'M':
    interfazMatricial(client)

transport.close()
