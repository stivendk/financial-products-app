import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { UrlConstants } from '../shared/constants/url-constants';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = `${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ResponseModel<Product[]>>{
    return this.http.get<ResponseModel<Product[]>>(this.endpoint);
  }

  getProduct(id: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.data?.find(product => product.id === id))
    );
  }

  createProduct(product: Product): Observable<ResponseModel<Product>>{
    return this.http.post(this.endpoint, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<ResponseModel<Product>>{
    return this.http.put(`${this.endpoint}/${id}`, product);
  }

  deleteProduct(id: string): Observable<ResponseModel<Product>>{
    return this.http.delete(`${this.endpoint}/${id}`);
  }

  verifyProductId(id: string): Observable<boolean>{
    return this.http.get<boolean>(`${this.endpoint}/${id}`);
  }
}
