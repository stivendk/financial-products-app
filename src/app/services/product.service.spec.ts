import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { UrlConstants } from '../shared/constants/url-constants';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController

  const mockProduct: Product = {
    id: '1', 
    name: 'Product 1', 
    description: '200', 
    date_release: '2024-02-01', 
    date_revision: '2025-02-01', 
    logo: 'url'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    service.getProducts().subscribe(products => {
      if(products.data){
        expect(products.data.length).toBe(1);
        expect(products.data[0].name).toBe('Product 1');
      }
    });

    const req = httpMock.expectOne(`${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should fetch a product by ID', () => {
    service.getProduct('1').subscribe(product => {
      expect(product).toBeDefined();
      expect(product?.name).toBe('Product 1');
    });

    const req = httpMock.expectOne(`${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const mockProduct2: Product = {
      id: '2', 
      name: 'Product 2', 
      description: '200', 
      date_release: '2024-02-01', 
      date_revision: '2025-02-01', 
      logo: 'url'
    };

    service.createProduct(mockProduct2).subscribe(response => {
      expect(response.data?.id).toBe('2');
    });

    const req = httpMock.expectOne(`${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct2);
  });

  it('should update a product', () => {
    const updatedProduct: Partial<Product> = { name: 'Updated Product 1' };

    service.updateProduct('1', updatedProduct).subscribe(response => {
      expect(response.data?.name).toBe('Updated Product 1');
    });

    const req = httpMock.expectOne(`${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct('1').subscribe(response => {
      expect(response.data?.id).toBe('1');
    });

    const req = httpMock.expectOne(`${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProduct);
  });

  it('should verify product ID', () => {
    service.verifyProductId('1').subscribe(isValid => {
      expect(isValid).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiHost}${UrlConstants.PRODUCT_ENDPOINTS.PRODUCTS}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
