
package idonacion;

import java.rmi.Remote;
import java.rmi.RemoteException;


public interface idonacion_servidor extends Remote{
    
    boolean estaRegistrado(String cliente) throws RemoteException;
    int getNumClientes() throws RemoteException;
    double getCantidadParcial() throws RemoteException;
    void aniadeDonacion(String cliente, double cantidad) throws RemoteException;
    void confirmaRegistro(String cliente) throws RemoteException;
    idonacion_servidor getServidorReplica(String host, String nombre) throws RemoteException;
    String getNombre() throws RemoteException;   
}
