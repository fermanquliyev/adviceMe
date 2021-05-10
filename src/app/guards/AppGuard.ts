import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../providers/auth.service";
@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate, CanActivateChild, CanLoad {
  /**
   *
   */
  constructor(private _authService: AuthService,private _router:Router) {
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    if (route.data && route.data["auth"]) {
      if(this._authService.isAuthenticated()){
        return true;
      } else{
        this._authService.clearToken();
        this._router.navigateByUrl("/login");
        return false;
      }
    } else if (route.data && route.data["nonAuth"]) {
      if(this._authService.isAuthenticated()){
        this._router.navigateByUrl("/app/tabs/schedule");
        return false;
      } else{
        return true;
      }
    } else {
      return true;
    }
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (route.data && route.data["auth"]) {
      if(this._authService.isAuthenticated()){
        return true;
      } else{
        this._authService.clearToken();
        this._router.navigateByUrl("/login");
        return false;
      }
    } else if (route.data && route.data["nonAuth"]) {
      if(this._authService.isAuthenticated()){
        this._router.navigateByUrl("/app/tabs/schedule");
        return false;
      } else{
        return true;
      }
    } else {
      return true;
    }
  }
}
