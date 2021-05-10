import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { Config } from 'protractor';
import { finalize } from 'rxjs/operators';
import { CommentService } from '../../../providers/comment.service';
import { PostDto, PostService, UserDto } from '../../../providers/post.service';
import { CurrentUser, UserData } from '../../../providers/user-data';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: PostDto;
  postContent:any = {};
  currentUser: CurrentUser = {} as any;
  commentText:string;
  commentBusy:boolean;
  @Output() onRemove = new EventEmitter<number>();
  constructor(
    public postService: PostService,
    public commentService: CommentService,
    public alertCtrl:AlertController
  ) { }

  ngOnInit() {
    this.currentUser = UserData.currentUser;
    try {
      this.postContent = JSON.parse(this.post.text);
    } catch (error) {
      console.error(error);
    }
  }

  async deletePost(){
    const alert = await this.alertCtrl.create({
      header: 'Yazını sil',
      message: "Bu yazını silmək istədiyinizdən əminsiniz?",
      buttons: [
        {
          text: "Xeyr",
        },
        {
          text: "Bəli, sil!",
          handler: () => {
            this.postService.deletePost(this.post.id).subscribe(result=>{
              this.onRemove.emit(this.post.id);
            });
          },
        },
      ],
    });
    // now present the alert on top of all other content
    await alert.present();

  }

  deleteComment(id:number,index:number){
    this.commentService.deleteComment(id).subscribe(result=>{
      this.post.comments.splice(index,1);
    });
  }

  createComment(){
    this.commentBusy = true;
    this.commentService.createComment({
      postId:this.post.id,
      text:this.commentText
    })
    .pipe(finalize(()=>this.commentBusy = false))
    .subscribe(result=>{
      this.post.comments = [
        {
          id:result.id,
          createdAt:new Date(),
          creator:this.currentUser as any,
          text:this.commentText
        }
        , ...this.post.comments];
        this.commentText = '';
    })
  }
}
