import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth.service';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;
  appName = 'Danışman';
  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,
    public userData: UserData,
    public auth: AuthService
  ) {}

  startApp() {
    this.router
      .navigateByUrl('/login', { replaceUrl: true })
      .then(() => this.storage.set('ion_did_tutorial', true));
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ionViewWillEnter() {
    this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
          const isLoggedId = this.auth.isAuthenticated();
          if(isLoggedId){
            this.router.navigateByUrl('/tabs/schedule', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
      }
    });

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
