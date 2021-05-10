import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { AuthService, LoginInput } from '../../providers/auth.service';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: LoginInput = { email: '', password: '' };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    public auth: AuthService
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.auth.login(this.login,"/app/tabs/schedule");
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
