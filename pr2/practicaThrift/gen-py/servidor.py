import glob
import sys
import numpy as np

from calculadora import Calculadora

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer 

import logging

logging.basicConfig(level=logging.DEBUG)


class CalculadoraHandler:
    def __init__(self):
        self.log = {}

    def ping(self):
        print("me han hecho ping()")

    def suma(self, n1, n2):
        return n1 + n2

    def resta(self, n1, n2):
        return n1 - n2

    def multiplicacion(self, n1, n2):
        return n1 * n2
    
    def division(self, n1, n2):
        return n1 / n2
    
    def modulo(self, n1, n2):
        return n1 % n2
    
    def divisionEntera(self, n1, n2):
        return (int)(n1/n2)

    def maximo(self, vec):
        arr = np.array(vec)
        return np.amax(arr)

    def minimo(self, vec):
        arr = np.array(vec)
        return np.amin(arr)

    def vectorPorEscalar(self, vec, esc):
        arr = np.array(vec)
        return (arr*esc).tolist()

    def vectorMasEscalar(self, vec, esc):
        arr = np.array(vec)
        return (arr+esc).tolist()

    def vectorMenosEscalar(self, vec, esc):
        arr = np.array(vec)
        return (arr-esc).tolist()

    def vectorEntreEscalar(self, vec, esc):
        arr = np.array(vec)
        return (arr/esc).tolist()

    def sumaColumnas(self, mat):
        mat = np.array(mat)
        return (np.sum(mat, axis=0)).tolist()

    def sumaFilas(self, mat):
        mat = np.array(mat)
        return (np.sum(mat, axis=1)).tolist()


if __name__ == "__main__":
    handler = CalculadoraHandler()
    processor = Calculadora.Processor(handler)
    transport = TSocket.TServerSocket(host="127.0.0.1", port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print("iniciando servidor...")
    server.serve()
    print("fin")