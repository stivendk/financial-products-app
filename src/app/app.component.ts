import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'financial-products-app';
  isLoading = false;

  constructor(private loadingService: LoadingService){}

  ngOnInit(): void {
    this.loadingService.isLoading$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }
}
