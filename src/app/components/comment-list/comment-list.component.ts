import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  comments: any[] = [];
  public postID: string;
  public author!: any;
  authorData!: any;
  subscription!: Subscription;

  constructor(private firestoreService: FirestoreService, private route: ActivatedRoute) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getComments();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getComments() {
    this.subscription = this.firestoreService
      .fetchComments()
      .subscribe((response) => {
        return this.buildComments(response);
      });
  }

  async buildComments(response: any) {
    if (
      response.postID === this.postID &&
      !this.comments.some((e) => e.id === response.id)
    ) {
      const author = await this.getAuthor(response.userID);
      const data = response;
      this.comments.push({ author, ...data });
    }
  }

  async getAuthor(userID: string): Promise<string> {
    this.authorData = await this.firestoreService.getCommentAuthor(userID);
    return this.authorData.username;
  }
}
