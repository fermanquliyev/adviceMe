import { Component } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';
import { CategoryData } from '../../providers/category-data';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;

  categories: {name: string, icon: string, id:number, isChecked: boolean}[] = [];

  constructor(
    private config: Config,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) { }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;

    // passed in array of track names that should be excluded (unchecked)
    const excludedCategories = this.navParams.get('excludedCategories');

    CategoryData.categories.forEach(cat => {
      this.categories.push({
        name: cat.text,
        icon: 'star',
        id:cat.id,
        isChecked: (excludedCategories.indexOf(cat.id) === -1)
      });
    });
  }

  selectAll(check: boolean) {
    // set all to checked or unchecked
    this.categories.forEach(cat => {
      cat.isChecked = check;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    const excludedCategories = this.categories.filter(c => !c.isChecked).map(c => c.id);
    this.dismiss(excludedCategories);
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }
}
