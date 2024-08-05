import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessage } from '../shared/utils/error-messages/error-message-form';
import { SequenceGenerator } from '../shared/utils/error-messages/sequence-generator';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductComponent,
    ConfirmModalComponent
  ],
  imports: [
    ProductsRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    ErrorMessage,
    SequenceGenerator
  ]
})
export class ProductsModule { }
