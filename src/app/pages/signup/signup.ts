import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { RegistrationInput} from '../../interfaces/user-options';
import { AuthService } from '../../providers/auth.service';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: RegistrationInput =<any>{ email: '', password: '', type: "USER", subType:"DEFAULT" };
  submitted = false;

  constructor(
    public router: Router,
    public auth: AuthService
  ) {}

  ionViewWillEnter(){
    this.signup =<any>{ email: '', password: '', type: "USER", subType:"DEFAULT" };
    this.submitted = false;
  }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.auth.signup(this.signup, "/login");
    }
  }
  log(){
    console.log(this.signup);
  }
}
