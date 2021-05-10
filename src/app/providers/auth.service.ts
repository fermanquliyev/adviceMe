import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastController } from "@ionic/angular";
import { environment } from "../../environments/environment";
import { RegistrationInput } from "../interfaces/user-options";
import { UserDto } from "./post.service";
import { CurrentUser } from "./user-data";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  remoteServiceBaseUrl: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {
    this.remoteServiceBaseUrl = environment.remoteServiceBaseUrl;
  }

  login(input: LoginInput, navigateUrl: string) {
    this.http.post(this.url("/api/v1/login"), input).subscribe((result) => {
      this.setToken(result["accessToken"]);
      window.dispatchEvent(new CustomEvent("user:login"));
      this.router.navigateByUrl(navigateUrl);
    });
  }

  logout() {
    this.http.post(this.url("/api/v1/logout"), null).subscribe((result) => {
      this.clearToken();
      window.dispatchEvent(new CustomEvent("user:logout"));
      this.router.navigateByUrl("/login");
    });
  }

  signup(input: RegistrationInput, navigateUrl: string) {
    this.http.post(this.url("/api/v1/sign-up"), input).subscribe((result) => {
      this.toastController
        .create({
          message: "Qeydiyyat tamamlandı. Daxil ola bilərsiniz",
          duration: 2000,
          color: "success",
        })
        .then((toast) => toast.present());
      this.router.navigateByUrl(navigateUrl);
    });
  }

  private setToken(token: string) {
    localStorage.setItem("AdviseMeToken", token);
  }

  getToken(): string {
    return localStorage.getItem("AdviseMeToken");
  }

  clearToken(): void {
    localStorage.removeItem("AdviseMeToken");
  }
  url(url: string) {
    return this.remoteServiceBaseUrl + url;
  }
  isAuthenticated(): boolean {
    const token = this.getToken();
    var helper = new JwtHelperService();
    return helper.isTokenExpired(token) == false;
  }

  getUserProfile(){
    return this.http.get<CurrentUser>(this.url("/api/v1/user/profile"));
   }

   getSpecialists(page:number, size:number){
    return this.http.get<{data:CurrentUser[]}>(this.url(`/api/v1/user/specialist?page=${page}&size=${size}`));
   }
}

export interface LoginInput {
  email: string;
  password: string;
}
