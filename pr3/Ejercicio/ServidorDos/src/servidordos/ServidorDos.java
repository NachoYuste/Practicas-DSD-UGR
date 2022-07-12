/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package servidordos;

import Donacion.DonacionDos;
import java.net.MalformedURLException;
import java.rmi.Naming;
import java.rmi.RemoteException;


public class ServidorDos {

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
            
            DonacionDos donacionObj2 = new DonacionDos(nombreServer, nombreReplica);
            Naming.rebind(nombreServer, donacionObj2);
            System.out.println("Servido de donaciones 2 preparado");
        }
        catch(RemoteException | MalformedURLException e){
            System.err.println("Excepción: " + e);
        }

    }
}

