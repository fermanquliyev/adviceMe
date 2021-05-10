import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Category } from "./post.service";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  remoteServiceBaseUrl: string;
  constructor(private http: HttpClient) {
    this.remoteServiceBaseUrl = environment.remoteServiceBaseUrl;
  }

  getCategories() {
    return this.http.get<GetCategoriesOutput>(this.url("/category"));
  }
  url(url: string) {
    return this.remoteServiceBaseUrl + url;
  }
}

export interface GetCategoriesOutput {
  data: Category[];
}
