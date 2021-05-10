import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreatePostInput } from './post.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {


remoteServiceBaseUrl: string;
  constructor(private http: HttpClient) {
    this.remoteServiceBaseUrl = environment.remoteServiceBaseUrl;
  }


  createComment(input: {postId:number, text:string}) {
    return this.http.post<{id:number}>(this.url("/api/v1/comment"), input);
  }

  deleteComment(id: number) {
    return this.http.delete<void>(this.url("/api/v1/comment/" + id));
  }
  url(url: string) {
    return this.remoteServiceBaseUrl + url;
  }
}
