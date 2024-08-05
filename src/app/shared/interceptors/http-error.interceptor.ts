import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.status === 400 || error.status === 404) {
                    errorMessage = this.getErrorMessage(error);
                } else {
                    errorMessage = 'An unexpected error occurred';
                }
                return throwError(() => ({name: error.statusText, message: errorMessage}))
            })
        )
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.error && error.error.message) {
            return error.error.message;
        }
        return 'An error occurred';
    }

}