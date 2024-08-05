import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { SharedConstants } from 'src/app/shared/constants/shared-constants';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  totalResults: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  searchText: string = '';
  previous = SharedConstants.PREVIOUS;
  next = SharedConstants.NEXT;
  showModal: boolean = false;
  productToDelete: Product | null = null;
  
  isOpen: boolean[] = [];
  products: Product[] = [];
  displayedProducts: Product[] = [];
  pageSizeOptions: number[] = [5, 10, 20];
  options = [SharedConstants.UPDATE, SharedConstants.REMOVE];
  

  constructor(
    private productService: ProductService,
    private router: Router,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.updateTextButtonPagination(window.innerWidth);
  }

  loadProducts() {
    this.loadingService.setLoading(true);
    this.productService.getProducts().subscribe(response => {
      this.products = response.data ?? [];
      this.totalResults = this.products.length;
      this.updateDisplayedProducts();
      this.isOpen = Array(this.displayedProducts.length).fill(false);
      setTimeout(() => {
        this.loadingService.setLoading(false);
      }, 1000);
    });
  }

  updateDisplayedProducts() {
    const filteredProducts = this.products
      .filter(product => product.name.toLowerCase().includes(this.searchText.toLowerCase()));
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedProducts = filteredProducts.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = +target.value;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  onSearchTextChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.updateDisplayedProducts();
  }

  selectOption(option: string, product: Product) {
    this.isOpen = this.isOpen.map(() => false);
    switch (option) {
      case SharedConstants.UPDATE:
        this.updateProduct(product);
        break;

      case SharedConstants.REMOVE:
        this.removeProduct(product);
        break;
    }
  }

  public addProduct() {
    this.router.navigate(['/add']);
  }

  private updateProduct(product: Product) {
    this.router.navigate([`/${product.id}`]);
  }

  public removeProduct(product: Product) {
    this.productToDelete = product;
    this.showModal = true;
  }

  public confirmRemoveProduct() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe(() => {
        this.loadProducts();
      });
      this.productToDelete = null;
    }
    this.showModal = false;
  }

  toggleDropdown(index: number) {
    this.isOpen = this.isOpen.map((isOpen, i) => i === index ? !isOpen : false);
  }

  updateTextButtonPagination(width: number) {
    let screen = width < 768;
    this.previous = screen ? '<' : SharedConstants.PREVIOUS;
    this.next = screen ? '>' : SharedConstants.NEXT;
    this.isOpen = Array(this.displayedProducts.length).fill(width < 1020 ? true : false);
  }

  confirmRemove() {
    this.confirmRemoveProduct();
  }

  cancelModal() {
    this.productToDelete = null;
    this.showModal = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.dropdown-menu')
      && !clickedElement.classList.contains('dropdown-button')
      && window.innerWidth > 1020) {
      this.isOpen = this.isOpen.map(() => false);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateTextButtonPagination(event.target.innerWidth);
  }
}