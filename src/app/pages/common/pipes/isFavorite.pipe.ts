import { Pipe, PipeTransform } from '@angular/core';
import { UserData } from '../../../providers/user-data';

@Pipe({
  name: 'isFavorite'
})
export class IsFavoritePipe implements PipeTransform {

  constructor(private userData: UserData) {
  }
  transform(postId: any): boolean {
    return this.userData.hasFavorite(postId);
  }

}
