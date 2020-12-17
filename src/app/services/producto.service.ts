import { Injectable } from '@angular/core';
import {Observable, of , throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import { Producto } from '../models/producto';
import { Router } from '@angular/router';
import {catchError,  map} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private httpHeaders = new HttpHeaders({ 'Content-Type':'application/json'});
  private productoUrl:string = 'http://localhost:9090/productos';//endpoint
 

  constructor(private http: HttpClient, private router:Router,
    private authService: AuthService) { }

  private isNoAutorization(e): boolean{
    if(e.status==401 || e.status==403){
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }
  getProductos():Observable<any>{
    return this.http.get(this.productoUrl+'/all');
  }
  getProducto(id:number):Observable<any> {
    return this.http.get(`${this.productoUrl}/${id}`).pipe(
      catchError(e =>{
        this.router.navigate(['/productos']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(e);
      })
    );
  }/*
  updateLogica(id:number):Observable<number> {
    return this.http.put<number>(this.rolUrl+"/update/logica/"+id).pipe(
      map((response:any) =>response),
      catchError(e =>{
        if(this.isNoAutorization(e)){
        return throwError(e)
        }
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }*/
  addProducto(producto: Producto): Observable<number>{
    return this.http.post<number>(this.productoUrl+"/add", producto).pipe(
      map((response:any) =>response),
      catchError(e =>{
            if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
      );
  }

  deleteProducto(id: number): Observable<number>{
    return this.http.delete<number>(this.productoUrl+"/delete/"+id ).pipe(
    catchError(e =>{
 
      console.error(e.error.mensaje);
      Swal.fire(e.error.mensaje, e.error.error, 'error');
      return throwError(e);
    })
    );
  }

  updateProducto(producto: Producto):Observable<number> {
    return this.http.put<number>(`${this.productoUrl}/update/${producto.idproducto}`, producto).pipe(
      map((response:any) =>response),
      catchError(e =>{
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
