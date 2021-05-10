import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';
import { SharedModule } from '../common/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MapPageRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    MapPage,
  ]
})
export class MapModule { }
