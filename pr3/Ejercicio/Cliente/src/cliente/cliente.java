/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package cliente;

import idonacion.idonacion_cliente;
import java.rmi.registry.LocateRegistry; import java.rmi.*;
import java.rmi.registry.Registry; import java.util.Scanner;

public class cliente {
    
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_RESET = "\u001B[0m";

    public static void main(String[] args) {
        
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        
        
        if(args.length!=1)
            System.exit(0);
        
        //Crear el escaner para leer los datos de entrada
        Scanner sc = new Scanner (System.in);
        
        //Inicializar nombre de uno de los servidores
        String nombreServidor = args[0]; 
        
        try{
            //Crear el stub para el cliente para el sevidor en localhost
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            idonacion_cliente donacionObj = (idonacion_cliente)mireg.lookup(nombreServidor);
            
            boolean run = true, login = false;
            String opcionMenuPral="", opcionMenuDon = "", usuario="", servidor="";
            double donacion, totalDonado;
            
            while(run){
                
                //MENÚ PRINCIPAL
                do{
                    System.out.println("\nElija una opción: ");
                    System.out.println("\tRegistrarse -> R");
                    System.out.println("\tIniciar sesion -> L");
                    System.out.println("\tSalir -> S");
                    opcionMenuPral = sc.nextLine().toUpperCase();
                }while(!opcionMenuPral.equals("R") && !opcionMenuPral.equals("L") && !opcionMenuPral.equals("S"));
                
                
                switch(opcionMenuPral){
                    
                    case "R":
                        System.out.println("\nIntroduzca el nombre del nuevo usuario:");
                        usuario = sc.nextLine();
                        
                        boolean registrado = donacionObj.registro(usuario);
                        
                        if(registrado)
                            System.out.println(ANSI_GREEN + "Usuario " + usuario + " registrado exitosamente" + ANSI_RESET);
                        else
                            System.out.println(ANSI_RED + "El usuario ya existe. No se registro ningun usuario" + ANSI_RESET);
                        
                    break;
                    
                    case "L":
                        
                        System.out.println("\nIntroduzca su usuario:");
                        usuario = sc.nextLine();
                        
                        servidor = donacionObj.existeUsuario(usuario);
                        
                        if(servidor!=null){
                            
                            //Actualizar a la instancia donde está conectado realmente el usuario
                            donacionObj = (idonacion_cliente)mireg.lookup(servidor);
                            
                            System.out.println(ANSI_GREEN + "Usuario identificado en el servidor " + servidor + ANSI_RESET);
                            System.out.println("Puede proceder al sistema de donaciones");
                            login = true;
                        }
                        else
                            System.out.println(ANSI_RED + "El usuario no existe en el sistema" + ANSI_RESET);
                        
                    break;
                    
                    case "S":
                        System.out.println("Se va a cerrar la sesión");
                        run = false;
                    break;
                }
                    
                while(login){
                     
                    //MENÚ DE USUARIO
                    do{
                        System.out.println("\nElija una opcion: ");
                        System.out.println("\tDonar -> D");
                        System.out.println("\tConsultad cantidad donada - > C");
                        System.out.println("\tCerrar sesion -> S");
                        opcionMenuDon = sc.nextLine().toUpperCase();
                    }while(!opcionMenuDon.equals("D") && !opcionMenuDon.equals("C") && !opcionMenuDon.equals("S"));
                
                    
                    switch(opcionMenuDon){
                        
                        case "D":
                            
                            do{
                                System.out.println("\nIntroduzca la cantidad a donar (debe ser un valor positivo):");
                                donacion = Double.parseDouble(sc.nextLine());
                            }while(donacion<=0);
                            
                            donacionObj.donar(usuario, donacion);
                            System.out.println(ANSI_GREEN + "Ha donado " + donacion +", muchas gracias." + ANSI_RESET);
                            
                        break;
                        
                        case "C":
                            System.out.println("\nConsulta de cantidad total de dinero donado en el sistema");
                            
                            totalDonado = donacionObj.consultaTotalDonado(usuario);
                            
                            if(totalDonado == -1)
                                System.out.println(ANSI_RED + "No puede ver el total donado si no ha hecho una donacion" + ANSI_RESET);
                            else
                                System.out.println(ANSI_GREEN + "Se ha donado un total de "+totalDonado+" euros" + ANSI_RESET);
                        break;
                        
                        case "S":
                            System.out.println("\nSe va a cerrar la sesion...");
                            login = false;
                        break;
                        
                    }
                }
            }
        }
        
        catch(RemoteException | NotBoundException e){
            System.err.println("Excepcion del sistema: "+e);
        }
        
    }
    
}
