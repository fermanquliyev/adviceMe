import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";

import { MenuController, Platform, ToastController } from "@ionic/angular";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Storage } from "@ionic/storage";

import { UserData } from "./providers/user-data";
import { AuthService } from "./providers/auth.service";
import { CategoryData } from "./providers/category-data";
import { CategoryService } from "./providers/category.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: "Yazılar",
      url: "/app/tabs/schedule",
      icon: "newspaper",
    },
    {
      title: "Mütəxəsislər",
      url: "/app/tabs/speakers",
      icon: "people",
    },
    {
      title: "Profilim",
      url: "/app/tabs/map",
      icon: "person-circle",
    },
    {
      title: "Haqqında",
      url: "/app/tabs/about",
      icon: "information-circle",
    },
  ];
  loggedIn = false;
  dark = (localStorage.getItem('darkMode') || 'false')=='true';

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private auth: AuthService,
    private categoryService: CategoryService
  ) {
    this.initializeApp();
    this.listenForLoginEvents();
  }

  async ngOnInit() {
    this.loggedIn = this.auth.isAuthenticated();
    if (this.loggedIn) {
      if (!CategoryData.categories.length) {
        this.categoryService.getCategories().subscribe((result) => {
          CategoryData.categories = result.data;
        });
      }
      this.auth.getUserProfile().subscribe(result=>{
        UserData.currentUser = result;
      });
    }
    this.swUpdate.available.subscribe(async (res) => {
      const toast = await this.toastCtrl.create({
        message: "Yenilənmə var!",
        position: "bottom",
        buttons: [
          {
            role: "cancel",
            text: "Yenilə",
          },
        ],
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.auth.logout();
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set("ion_did_tutorial", false);
    this.router.navigateByUrl("/tutorial");
  }

  listenForLoginEvents() {
    window.addEventListener("user:login", () => {
      this.loggedIn = true;
      this.categoryService.getCategories().subscribe((result) => {
        CategoryData.categories = result.data;
      });
      this.auth.getUserProfile().subscribe(result=>{
        UserData.currentUser = result;
      });
    });

    window.addEventListener("user:logout", () => {
      this.loggedIn = false;
      UserData.currentUser = null;
    });
  }

  saveDarkMode(mode){
    localStorage.setItem('darkMode',mode);
  }
}
