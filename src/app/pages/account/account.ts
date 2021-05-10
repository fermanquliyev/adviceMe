import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { AuthService } from '../../providers/auth.service';

import { CurrentUser, UserData } from '../../providers/user-data';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  user: CurrentUser;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData,
    public auth: AuthService
  ) { }

  ngAfterViewInit() {
    this.user = UserData.currentUser;
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'E-poçtu dəyiş',
      buttons: [
        'Ləğv et',
        {
          text: 'Tamam',
          handler: (data: any) => {
            //this.userData.setUsername(data.username);
            this.getUsername();
          }
        }
      ],
      inputs: [
        {
          type: 'email',
          name: 'email',
          value: this.user.email,
          placeholder: 'E-poçt'
        }
      ]
    });
    await alert.present();
  }

  getUsername() {
    // this.userData.getUsername().then((username) => {
    //   this.username = username;
    // });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.auth.logout();
  }

  support() {
    this.router.navigateByUrl('/support');
  }
}
