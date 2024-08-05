import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, of, switchMap, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { ErrorMessage } from '../../shared/utils/error-messages/error-message-form';
import { ErrorMessages } from 'src/app/models/error-message.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  [x: string]: any;

  isEditMode: boolean = false;
  productForm: FormGroup;
  title: string | any;
  minDate: string;
  minRevisionDate: string = '';
  errors: ErrorMessages = {};

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private errorMessage: ErrorMessage,
    private ngZone: NgZone
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.showProduct();
  }

  showProduct() {
    this.route.params.pipe(
      switchMap(params => {
        if (params['id']) {
          this.isEditMode = true;
          return this.productService.getProduct(params['id']).pipe(
            tap((product) => {
              this.title = product?.name;
              this.setRevisionDate(product?.date_release);
            })
          );
        } else {
          this.title = 'Formulario de Registro';
          return of(null);
        }
      })
    ).subscribe(product => {
      if (product) {
        this.productForm.patchValue(product);
      }
    });
  }

  onReleaseDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const releaseDate = target.value;
    this.setRevisionDate(releaseDate);
  }

  setRevisionDate(releaseDate: string | undefined) {
    if (releaseDate) {
      const releaseDateObj = new Date(releaseDate);
      const revisionDateObj = new Date(releaseDateObj.setFullYear(releaseDateObj.getFullYear() + 1));
      this.minRevisionDate = revisionDateObj.toISOString().split('T')[0];
      this.productForm.get('date_revision')?.setValue(this.minRevisionDate);
    }
  }

  submitForm(): void {
    if (this.productForm.valid) {
      let productData = this.productForm.value;
      if (this.isEditMode) {
        this.productService.updateProduct(this.productForm.get('id')?.value, productData).subscribe(() => {
          this.ngZone.run(() => {
            this.router.navigate(['/products']);
          });
        });
      } else {
        this.productService.createProduct(productData).subscribe(() => {
          this.ngZone.run(() => {
            this.router.navigate(['/products']);
          });
        });
      }
    } else {
      this.errors = this.getFormValidationErrors();
    }
  }

  getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach(key => {
      const controlErrors: any = this.productForm.get(key)?.errors;
      if (controlErrors != null) {
        errors[key] = Object.keys(controlErrors).map(keyError => {
          return this.errorMessage.getErrorMessage(key, keyError);
        });
      }
    });
    return errors;
  }

  resetForm() {
    this.productForm.reset();
    this.errors = {};
  }

  invalidField(controlName: string) {
    if (this.productForm.get(controlName)?.valid) {
      delete this.errors[controlName];
    } else {
      this.errors[controlName] = this.getFormValidationErrors()[controlName] || [];
    }
  }
}
