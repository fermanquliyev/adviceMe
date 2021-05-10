import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, IonList, ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SpeakerData } from '../speaker-list/speaker-data';
import { CurrentUser, UserData } from '../../providers/user-data';
import { PostDto, PostService } from '../../providers/post.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html',
  styleUrls: ['./speaker-detail.scss'],
})
export class SpeakerDetailPage {

  @ViewChild("postList", { static: true }) postList: IonList;
  speaker: CurrentUser;
  queryText:string;
  createPostText:string;
  postDatas:PostDto[] = [];
  currentPage: number = 0;
  totalPage: number;
  speakerId:number;
  constructor(
    private route: ActivatedRoute,
    public actionSheetCtrl: ActionSheetController,
    public inAppBrowser: InAppBrowser,
    public postService: PostService,
    public toastCtrl: ToastController,
    public user: UserData,
    public alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.currentPage = 0;
    this.speakerId = +this.route.snapshot.paramMap.get('speakerId');
    this.speaker = SpeakerData.Speakers.find(x=>x.id==this.speakerId);
    this.getPosts(1);
  }

  openExternalUrl(url: string) {
    this.inAppBrowser.create(
      url,
      '_blank'
    );
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any).cordova &&
              (window as any).cordova.plugins.clipboard
            ) {
              (window as any).cordova.plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openContact(speaker: CurrentUser) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async getPosts(nextPage: number) {
    // Close any open sliding items when the schedule updates
    if (this.postList) {
      this.postList.closeSlidingItems();
    }
    this.postService
      .search({
        categoryName: undefined,
        excludedCategories: undefined,
        creatorId: undefined,
        page: this.currentPage + nextPage,
        pageSize: nextPage?10:11,
        wallUserId: this.speakerId,
        post: this.queryText,
      })
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

  createPost() {
    this.postService
      .createPost({
        text: JSON.stringify({ text: this.createPostText }),
        categoryId: 1,
        wallUserId: this.speaker.id,
      })
      .subscribe((result) => {
        const toast = this.toastCtrl
          .create({
            header: `Uğurla paylaşıldı.`,
            duration: 3000,
            buttons: [
              {
                text: "Close",
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
}
