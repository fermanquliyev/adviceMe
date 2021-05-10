import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../providers/auth.service';
import { CurrentUser } from '../../providers/user-data';
import { SpeakerData } from './speaker-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage implements OnInit {
  speakers: CurrentUser[] = [];

  constructor(private _authService: AuthService, public ldCtrl:LoadingController) {}

  async ngOnInit() {
    var loading = await this.ldCtrl.create();
    loading.present();
    this._authService.getSpecialists(1,20)
    .pipe(finalize(()=>loading.dismiss()))
    .subscribe(result=>{
      this.speakers = result.data;
      SpeakerData.Speakers = [...result.data];
    })
  }
}
