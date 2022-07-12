typedef float Valor;
typedef char Operacion;

struct arg_simple {
	Valor val1;
	Valor val2;
	Operacion op;
};

struct arg_vectorial {
	Valor vec1<>;
	Valor vec2<>;
	Operacion op;
};

struct resp_vectorial {
	Valor res_vec<>;
};

program CALCULADORA_INTER {
	version SIMPLE {
		float calculadora_simple(arg_simple) = 1;
		resp_vectorial calculadora_vectorial(arg_vectorial) = 2;
	} =1;
} = 0x20000255;
