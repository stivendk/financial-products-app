import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { LoadingService } from './services/loading.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [AppComponent],
      providers: [
        {
          provide: LoadingService,
          useValue: {
            isLoading$: of(false)
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with title "financial-products-app"', () => {
    expect(component.title).toBe('financial-products-app');
  });

  it('should initialize isLoading to false', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should update isLoading based on loadingService', () => {
    const mockLoadingService = TestBed.inject(LoadingService) as any;
    mockLoadingService.isLoading$ = of(true);
    
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isLoading).toBe(true);
  });
});
