import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from 'src/app/shared/utils/error-messages/error-message-form';
import { of } from 'rxjs';
import { ResponseModel } from 'src/app/models/response.model';
import { Product } from 'src/app/models/product.model';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let router: Router;
  let route: ActivatedRoute;

  const mockProduct = {
    id: '123',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test-logo.png',
    date_release: '2023-01-01',
    date_revision: '2024-01-01'
  };

  const mockResponse: ResponseModel<Product> = {
    data: mockProduct
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        ProductService,
        ErrorMessage,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: '123'})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.controls['id']).toBeDefined();
    expect(component.productForm.controls['name']).toBeDefined();
    expect(component.productForm.controls['description']).toBeDefined();
    expect(component.productForm.controls['logo']).toBeDefined();
    expect(component.productForm.controls['date_release']).toBeDefined();
    expect(component.productForm.controls['date_revision']).toBeDefined();
  });

  it('should load product on init if id is present', () => {
    jest.spyOn(productService, 'getProduct').mockReturnValue(of(mockProduct));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.title).toBe(mockProduct.name);
    expect(component.productForm.value).toEqual(mockProduct);
  });

  it('should set minRevisionDate based on date_release', () => {
    component.setRevisionDate('2023-01-01');
    expect(component.minRevisionDate).toBe('2024-01-01');
  });

  it('should call createProduct on form submit if not in edit mode', () => {
    component.isEditMode = false;
    const createProductSpy = jest.spyOn(productService, 'createProduct').mockReturnValue(of(mockResponse));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.productForm.setValue(mockProduct);
    component.submitForm();

    expect(createProductSpy).toHaveBeenCalledWith(mockProduct);
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should call updateProduct on form submit if in edit mode', () => {
    component.isEditMode = true;
    const updateProductSpy = jest.spyOn(productService, 'updateProduct').mockReturnValue(of(mockResponse));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.productForm.setValue(mockProduct);
    component.submitForm();

    expect(updateProductSpy).toHaveBeenCalledWith(mockProduct.id, mockProduct);
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });

  it('should display validation errors if form is invalid on submit', () => {
    component.productForm.setValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
    component.submitForm();
    expect(component.errors['id']).toBeDefined();
    expect(component.errors['name']).toBeDefined();
    expect(component.errors['description']).toBeDefined();
    expect(component.errors['logo']).toBeDefined();
    expect(component.errors['date_release']).toBeDefined();
    expect(component.errors['date_revision']).toBeDefined();
  });

  it('should reset form and errors on resetForm', () => {
    component.productForm.setValue(mockProduct);
    component.errors = { name: ['Error'] };

    component.resetForm();

    expect(component.productForm.value).toEqual({
      id: null,
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null
    });
    expect(component.errors).toEqual({});
  });

  it('should validate fields correctly', () => {
    component.productForm.controls['name'].setValue('');
    
    component.invalidField('name');
    expect(component.errors['name']).toBeDefined();

    component.productForm.controls['name'].setValue('Valid Name');
    component.invalidField('name');
    expect(component.errors['name']).toBeUndefined();
  });
});
