
package idonacion;


import java.rmi.Remote;
import java.rmi.RemoteException;


/*
* Interfaz para la comunicación entre el usuario y el servidor
*/
public interface idonacion_cliente extends Remote{
    
    boolean registro(String nombre) throws RemoteException;
    void donar(String cliente, double cantidad) throws RemoteException;
    double consultaTotalDonado(String cliente) throws RemoteException;
    String existeUsuario(String cliente) throws RemoteException;
    
}
