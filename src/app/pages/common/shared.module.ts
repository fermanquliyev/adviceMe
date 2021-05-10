import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { IonicModule } from '@ionic/angular';
import { IsFavoritePipe } from './pipes/isFavorite.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  declarations: [PostComponent,IsFavoritePipe],
  exports:[PostComponent]
})
export class SharedModule { }
