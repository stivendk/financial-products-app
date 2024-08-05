import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from 'src/app/services/product.service';
import { LoadingService } from 'src/app/services/loading.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from 'src/app/models/product.model';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let loadingService: LoadingService;

  const mockProduct: Product = {
    id: '1',
    name: 'Product 1',
    description: '200',
    date_release: '2024-02-01',
    date_revision: '2025-02-01',
    logo: 'url'
  };

  const mockProducts: Product[] = [mockProduct,
    {
      id: '2',
      name: 'Another Product',
      description: '200',
      date_release: '2024-02-01',
      date_revision: '2025-02-01',
      logo: 'url'
    }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ProductService, 
        {provide: LoadingService, useValue: {setLoading: jest.fn(), isLoading$: of(false)}}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    const mockProducts: Product[] = [mockProduct];
    jest.spyOn(productService, 'getProducts').mockReturnValue(of({ data: mockProducts }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(loadingService.setLoading).toHaveBeenCalledWith(true);
    expect(component.products).toEqual(mockProducts);
    expect(component.totalResults).toBe(mockProducts.length);
    expect(component.isOpen.length).toBe(mockProducts.length);

    setTimeout(() => {
      expect(loadingService.setLoading).toHaveBeenCalledWith(false);
    }, 1000);
  });

  it('should filter products based on search text', () => {
    component.products = mockProducts;

    component.searchText = 'Product';
    component.updateDisplayedProducts();

    expect(component.displayedProducts.length).toBe(2);
    expect(component.displayedProducts[0].name).toBe('Product 1');
  });

  it('should change the current page', () => {
    component.totalPages = 3;

    component.changePage(2);
    expect(component.currentPage).toBe(2);

    component.changePage(4);
    expect(component.currentPage).toBe(2);

    component.changePage(0);
    expect(component.currentPage).toBe(2);
  });

  it('should update items per page', () => {
    component.products = new Array(20).fill(mockProduct);
    component.onItemsPerPageChange({ target: { value: '10' } } as any);
    expect(component.itemsPerPage).toBe(10);
    expect(component.currentPage).toBe(1);
    expect(component.displayedProducts.length).toBe(10);
  });

  it('should open and close dropdown', () => {
    component.products = [mockProduct];
    component.isOpen = [false];
    component.toggleDropdown(0);
    expect(component.isOpen[0]).toBe(true);
    component.toggleDropdown(0);
    expect(component.isOpen[0]).toBe(false);
  });

  it('should handle modal for product deletion', () => {
    component.removeProduct(mockProduct);
    expect(component.productToDelete).toEqual(mockProduct);
    expect(component.showModal).toBe(true);

    jest.spyOn(productService, 'deleteProduct').mockReturnValue(of({}));
    component.confirmRemoveProduct();
    expect(component.productToDelete).toBeNull();
    expect(component.showModal).toBe(false);
  });
});
