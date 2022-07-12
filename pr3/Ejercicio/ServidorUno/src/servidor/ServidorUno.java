
package servidor;

import Donacion.DonacionDos;
import Donacion.DonacionUno;
import java.net.MalformedURLException;
import java.rmi.*;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.*;

/*
* Este es el servidor uno
* La única diferencia con el servidor replicado es que este
* se encarga de crear el registro.
* Por ello debe ejecutarse el primero
*/
public class ServidorUno{
    
    public static void main(String args[]){
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        
        if(args.length!=2){
            System.out.println("Los argumentos son: {nombre servidor principal} {nombre servidor replica}");
            System.exit(0);
        }
            
        
        String nombreServer = args[0];
        String nombreReplica = args[1];
        
        try{            
            Registry reg = LocateRegistry.createRegistry(1099);
            
            DonacionUno donacionObj1 = new DonacionUno(nombreServer, nombreReplica);
            Naming.rebind(nombreServer, donacionObj1);
            System.out.println("Servido de donaciones 1 preparado");

        }
        catch(RemoteException | MalformedURLException e){
            System.err.println("Excepción: " + e);
        }

    }
}
