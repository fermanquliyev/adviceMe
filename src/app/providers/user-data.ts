import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class UserData {
  static favorites: number[] = [];
  static currentUser:CurrentUser;
  HAS_LOGGED_IN = "hasLoggedIn";
  HAS_SEEN_TUTORIAL = "hasSeenTutorial";

  constructor(public storage: Storage) {
    if (UserData.favorites.length) {
      this.getFavorites().then((result) => {
        UserData.favorites = result;
      });
    }
  }

  hasFavorite(postId: number): boolean {
    return UserData.favorites.indexOf(postId) > -1;
  }

  addFavorite(postId: number): void {
    UserData.favorites.push(postId);
  }

  removeFavorite(postId: number): void {
    const index = UserData.favorites.indexOf(postId);
    if (index > -1) {
      UserData.favorites.splice(index, 1);
    }
  }

  saveFavourites() {
    this.storage.set("favorites", UserData.favorites);
  }

  getFavorites() {
    return this.storage.get("favorites");
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}

export interface CurrentUser {
  about: string;
  createdAt: Date;
  email: string;
  id: number;
  isAnonymous: boolean;
  name: string;
  subType: string;
  surname: string;
  type: string;
}
