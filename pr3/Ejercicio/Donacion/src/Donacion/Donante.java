package Donacion;



public class Donante {
    String nombre;
    double cantidadDonada;
    
    public Donante(String nombre){
        this.nombre = nombre;
        this.cantidadDonada = 0;
    }
    
    public void aumentaCantidadDonada(double c){
        this.cantidadDonada+=c;
    }
    
    public String getNombre(){
        return this.nombre;
    }
    
    public double getCantidadDonada(){
       return this.cantidadDonada; 
    }
    
    @Override
    public boolean equals(Object otro){
        
        return this.nombre.equals(((Donante)otro).nombre);
    }
    
}
