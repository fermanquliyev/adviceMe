import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PostService {
  remoteServiceBaseUrl: string;
  constructor(private http: HttpClient) {
    this.remoteServiceBaseUrl = environment.remoteServiceBaseUrl;
  }

  search(input: PostSearchInput) {
    return this.http.post<SearchPostOutput>(
      this.url("/api/v1/post/search"),
      input
    );
  }

  createPost(input: CreatePostInput) {
    return this.http.post<void>(this.url("/api/v1/post"), input);
  }

  deletePost(id: number) {
    return this.http.delete<void>(this.url("/api/v1/post/" + id));
  }
  url(url: string) {
    return this.remoteServiceBaseUrl + url;
  }
}

export interface PostSearchInput {
  categoryName: string;
  creatorId: number;
  excludedCategories: number[];
  page: number;
  pageSize: number;
  post: string;
  wallUserId: number;
}

export interface Category {
  id: number;
  text: string;
}

export interface UserDto {
  email: string;
  id: number;
  name: string;
  subType: string;
  surname: string;
  userType: string;
}

export interface Comment {
  createdAt: Date;
  creator: UserDto;
  id: number;
  text: string;
}

export interface PostDto {
  category: Category;
  comments: Comment[];
  createdAt: Date;
  creator: UserDto;
  id: number;
  text: string;
  wallUser: UserDto;
}

export interface SearchPostOutput {
  currentPage: number;
  data: PostDto[];
  totalPage: number;
}

export interface CreatePostInput {
  categoryId: number;
  text: string;
  wallUserId: number;
}
