import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    public router: Router,
    public toastController: ToastController
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if(token){
      request = request.clone({
        setHeaders: {
           "Authorization": `Bearer ${token}`
        },
      });
    }
    // request = request.clone({
    //   setHeaders: {
    //     'Origin': 'http://localhost:8100',
    //     'Access-Control-Request-Method': request.method,
    //     'Access-Control-Allow-Origin': 'http://localhost:8100',
    //     'Access-Control-Request-Headers':'Authorization,Origin'
    //   },
    // });
    return next.handle(request).pipe(
      tap(
        (event) => this.handleResponse(request, event),
        (error) => this.handleError(request, error)
      )
    );
  }

  handleResponse(req: HttpRequest<any>, event) {
    console.debug("Handling response for ", req.url, event);
    if (event instanceof HttpResponse) {
      console.debug(
        "Request for ",
        req.url,
        " Response Status ",
        event.status,
        " With body ",
        event.body
      );
    }
  }

  handleError(req: HttpRequest<any>, event) {
    if (event instanceof HttpErrorResponse) {
      console.error(
        "Request for ",
        req.url,
        " Response Status ",
        event.status,
        " With error ",
        event.error
      );
      if (event.status === 401) {
        this.auth.clearToken();
        this.router.navigateByUrl("/login");
      } else {
        const message = event.error.message || "Xəta baş verdi";
        const toast = this.toastController
          .create({
            message: message,
            duration: 2000,
            color: "danger",
          })
          .then((toast) => toast.present());
      }
    }
  }
}
