/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "dir.h"

float *
calculadora_simple_1_svc(arg_simple arg1,  struct svc_req *rqstp)
{
	static float  result;
	

	switch (arg1.op){
		
		case '+':
			result = arg1.val1 + arg1.val2;
		break;
		
		case '-':
			result = arg1.val1 - arg1.val2;
		break;

		case '/':
			result = arg1.val1 / arg1.val2;
		break;

		case 'x':
			result = arg1.val1 * arg1.val2;
		break;

		case '%':
			result = (int)arg1.val1 % (int)arg1.val2;
		break;

		case '|':
			result = (int)arg1.val1 / (int)arg1.val2;
		break;


	}

	return &result;
}


resp_vectorial *
calculadora_vectorial_1_svc(arg_vectorial arg1,  struct svc_req *rqstp)
{
	static resp_vectorial  result;

	xdr_free((xdrproc_t)xdr_resp_vectorial, (char *)&result);
	int tam = arg1.vec1.vec1_len;
	result.res_vec.res_vec_val = malloc(sizeof(float)*tam);
	result.res_vec.res_vec_len = tam;


	switch (arg1.op){
		case '+':

			for(int i=0; i<tam; i++)
				result.res_vec.res_vec_val[i] = arg1.vec1.vec1_val[i] + arg1.vec2.vec2_val[i];

		break;

		case '-':
		
			for(int i=0; i<tam; i++)
				result.res_vec.res_vec_val[i] = arg1.vec1.vec1_val[i] - arg1.vec2.vec2_val[i];

		break;

		case '*':
		
			for(int i=0; i<tam; i++)
				result.res_vec.res_vec_val[i] = arg1.vec1.vec1_val[i] * arg1.vec2.vec2_val[i];

		break;

		case '/':
		
			for(int i=0; i<tam; i++)
				result.res_vec.res_vec_val[i] = arg1.vec1.vec1_val[i] / arg1.vec2.vec2_val[i];

		break;
	}


	return &result;
}