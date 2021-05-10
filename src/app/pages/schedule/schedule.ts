import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  IonList,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController,
  Config,
} from "@ionic/angular";

import { ScheduleFilterPage } from "../schedule-filter/schedule-filter";
import { UserData } from "../../providers/user-data";
import {
  CreatePostInput,
  PostDto,
  PostService,
} from "../../providers/post.service";
import { finalize } from "rxjs/operators";

@Component({
  selector: "page-schedule",
  templateUrl: "schedule.html",
  styleUrls: ["./schedule.scss"],
})
export class SchedulePage {
  // Gets a reference to the list element
  @ViewChild("postList", { static: true }) postList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText:string;
  excludedCategories: number[] = [];
  postDatas: PostDto[] = [];
  currentPage: number = 0;
  totalPage: number;
  confDate: string;
  showSearchbar: boolean;
  createPostText: string;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config,
    public postService: PostService
  ) {}

  ionViewWillEnter() {
    this.currentPage = 0;
    this.getPosts(1);

    this.ios = this.config.get("mode") === "ios";
  }

  async getPosts(nextPage: number) {
    // Close any open sliding items when the schedule updates
    if (this.postList) {
      this.postList.closeSlidingItems();
    }
    var loading = await this.loadingCtrl.create();
    loading.present();
    this.postService
      .search({
        categoryName: undefined,
        excludedCategories: this.excludedCategories.length?this.excludedCategories:undefined,
        creatorId: undefined,
        page: this.currentPage + nextPage,
        pageSize: nextPage?10:11,
        wallUserId: undefined,
        post: this.queryText,
      })
      .pipe(finalize(() => loading.dismiss()))
      .subscribe((result) => {
        if(!nextPage){
          this.postDatas = result.data;
        }
        else{
          this.postDatas = [...this.postDatas, ...result.data];
        }
        this.currentPage = result.currentPage;
        this.totalPage = result.totalPage;
      });
  }

  async presentFilter() {
    console.log(this.excludedCategories);

    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedCategories: this.excludedCategories },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludedCategories = data;
      console.log(this.excludedCategories);
      this.getPosts(0);
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, post: PostDto) {
    if (this.user.hasFavorite(post.id)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, post, "Artıq əlavə olunub");
    } else {
      // Add as a favorite
      this.user.addFavorite(post.id);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `Yazı uğurla yadda saxlanıldı`,
        duration: 3000,
        buttons: [
          {
            text: "Bağla",
            role: "cancel",
          },
        ],
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }
  }

  async removeFavorite(
    slidingItem: HTMLIonItemSlidingElement,
    post: PostDto,
    title: string
  ) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: "Yadda saxlanılmışlardan silmək istəyirsinizmi?",
      buttons: [
        {
          text: "Bağla",
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
        {
          text: "Sil",
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(post.id);

            // close the sliding item and hide the option buttons
            slidingItem.close();
          },
        },
      ],
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `${network}-da paylaşıldı`,
      duration: Math.random() * 1000 + 500,
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }

  createPost() {
    this.postService
      .createPost({
        text: JSON.stringify({ text: this.createPostText }),
        categoryId: 1,
        wallUserId: UserData.currentUser.id,
      })
      .subscribe((result) => {
        const toast = this.toastCtrl
          .create({
            header: `Uğurla paylaşıldı.`,
            duration: 3000,
            buttons: [
              {
                text: "Bağla",
                role: "cancel",
              },
            ],
          })
          .then((x) => x.present());
          this.createPostText='';
        this.getPosts(0);
      });
  }

  deletePost(index:number){
    this.postDatas.splice(index,1); this.postDatas=[...this.postDatas];
  }
}
