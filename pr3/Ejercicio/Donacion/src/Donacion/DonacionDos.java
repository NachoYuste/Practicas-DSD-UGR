package Donacion;

import idonacion.idonacion_cliente;
import idonacion.idonacion_servidor;
import java.rmi.NotBoundException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;


public class DonacionDos extends UnicastRemoteObject implements  idonacion_servidor, idonacion_cliente{

    
    private HashMap<String, Donante> clientes;
    private double cantidadParcial;
    private String nombreServer, nombreReplica;
    
    
    public DonacionDos(String nombre, String nombreReplica) throws RemoteException{
        this.nombreServer = nombre;
        this.nombreReplica = nombreReplica;
        
        this.clientes = new HashMap<>();
        this.cantidadParcial = 0;
    }

    //-----------Métodos de conexión entre réplicas-----------\\
    
    @Override
    public boolean estaRegistrado(String cliente) throws RemoteException{
        return this.clientes.containsKey(cliente);
    }

    @Override
    public int getNumClientes() throws RemoteException{
        return this.clientes.size();
    }

    @Override
    public double getCantidadParcial() throws RemoteException{
        return this.cantidadParcial;
    }

    @Override
    public void confirmaRegistro(String cliente) throws RemoteException {
        Donante nuevo = new Donante(cliente);
        this.clientes.put(cliente,nuevo);
    }

    @Override
    public idonacion_servidor getServidorReplica(String host, String nombre) throws RemoteException{
        idonacion_servidor replica = null;
        
        try{
            Registry mireg = LocateRegistry.getRegistry(host, 1099);
            replica = (idonacion_servidor)mireg.lookup(nombre);
        }catch(NotBoundException | RemoteException e){
            System.err.println("Excepción del sistema: " + e);
        }
        
        return replica;        
    }
    
    @Override
    public String getNombre() throws RemoteException{
        return this.nombreServer;
    }
    
    @Override
    public void aniadeDonacion(String cliente, double cantidad) throws RemoteException{
        clientes.get(cliente).aumentaCantidadDonada(cantidad);
        this.cantidadParcial += cantidad;
    }
    
    

    //-----------Métodos de conexión entre servidor-cliente-----------\\

    @Override
    public boolean registro(String nombre) throws RemoteException{
        
        boolean registrado = false;
        
        if(!this.estaRegistrado(nombre)){
            
            idonacion_servidor replica = this.getServidorReplica("localhost", this.nombreReplica);
            
            if(!replica.estaRegistrado(nombre)){
                
                int numClientesServer = this.getNumClientes();
                int numClientesReplica = replica.getNumClientes();
                
                if(numClientesServer > numClientesReplica){
                    this.confirmaRegistro(nombre);
                }
                else{
                    replica.confirmaRegistro(nombre);
                }
                
                registrado = true;
            }         
        }
        return registrado;
    }
    
    

    @Override
    public void donar(String cliente, double cantidad) throws RemoteException{
        String nombreserver = this.existeUsuario(cliente);
        
        if(nombreserver!=null){
            
            if(nombreserver.equals(this.nombreServer)){
                this.aniadeDonacion(cliente, cantidad);
            }
            else if (nombreserver.equals(this.nombreReplica)){
                idonacion_servidor replica = this.getServidorReplica("localhost", this.nombreReplica);
                replica.aniadeDonacion(cliente, cantidad);
            }
            
            System.out.println("Se ha añadido la cantidad: "+cantidad+" al servidor: "+nombreserver);
        }
        else{
            System.out.println("El cliente no existe en el sistema");
        }
    }

    @Override
    public double consultaTotalDonado(String cliente) throws RemoteException{
        
        if(this.estaRegistrado(cliente)){
                        
            if(clientes.get(cliente).getCantidadDonada()!=0){
                idonacion_servidor replica = this.getServidorReplica("localhost", this.nombreReplica);           
                return replica.getCantidadParcial() + this.getCantidadParcial();
            }
        }
        
        return -1;
    }

    @Override
    public String existeUsuario(String cliente) throws RemoteException{

        if(this.estaRegistrado(cliente)) return this.nombreServer;
        else{
            idonacion_servidor replica = this.getServidorReplica("localhost", this.nombreReplica);
            
            if(replica.estaRegistrado(cliente)) return replica.getNombre();
        }
        
     return null;
    }
}