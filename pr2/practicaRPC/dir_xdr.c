/*
 * Please do not edit this file.
 * It was generated using rpcgen.
 */

#include "dir.h"

bool_t
xdr_Valor (XDR *xdrs, Valor *objp)
{
	register int32_t *buf;

	 if (!xdr_float (xdrs, objp))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_Operacion (XDR *xdrs, Operacion *objp)
{
	register int32_t *buf;

	 if (!xdr_char (xdrs, objp))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_arg_simple (XDR *xdrs, arg_simple *objp)
{
	register int32_t *buf;

	 if (!xdr_Valor (xdrs, &objp->val1))
		 return FALSE;
	 if (!xdr_Valor (xdrs, &objp->val2))
		 return FALSE;
	 if (!xdr_Operacion (xdrs, &objp->op))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_arg_vectorial (XDR *xdrs, arg_vectorial *objp)
{
	register int32_t *buf;

	 if (!xdr_array (xdrs, (char **)&objp->vec1.vec1_val, (u_int *) &objp->vec1.vec1_len, ~0,
		sizeof (Valor), (xdrproc_t) xdr_Valor))
		 return FALSE;
	 if (!xdr_array (xdrs, (char **)&objp->vec2.vec2_val, (u_int *) &objp->vec2.vec2_len, ~0,
		sizeof (Valor), (xdrproc_t) xdr_Valor))
		 return FALSE;
	 if (!xdr_Operacion (xdrs, &objp->op))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_resp_vectorial (XDR *xdrs, resp_vectorial *objp)
{
	register int32_t *buf;

	 if (!xdr_array (xdrs, (char **)&objp->res_vec.res_vec_val, (u_int *) &objp->res_vec.res_vec_len, ~0,
		sizeof (Valor), (xdrproc_t) xdr_Valor))
		 return FALSE;
	return TRUE;
}
