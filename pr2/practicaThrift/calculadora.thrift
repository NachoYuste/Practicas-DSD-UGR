typedef list< list<double>> Matriz

service Calculadora{
   void ping(),
   double suma(1:double num1, 2:double num2),
   double resta(1:double num1, 2:double num2),
   double multiplicacion(1:double num1, 2:double num2),
   double division(1:double num1, 2:double num2),
   double modulo(1:double num1, 2:double num2),
   double divisionEntera(1:double num1, 2:double num2),
   double maximo(1:list<double> vec),
   double minimo(1:list<double> vec),
   list<double> vectorPorEscalar(1:list<double> vec, 2:double esc),
   list<double> vectorMasEscalar(1:list<double> vec, 2:double esc),
   list<double> vectorMenosEscalar(1:list<double> vec, 2:double esc),
   list<double> vectorEntreEscalar(1:list<double> vec, 2:double esc),
   list<double> sumaColumnas(1:Matriz mat),
   list<double> sumaFilas(1:Matriz mat),
}