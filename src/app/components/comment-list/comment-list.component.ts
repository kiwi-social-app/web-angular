import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

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

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.dataService.getAllComments().subscribe((data: any) => {
      data.forEach(async (element: any) => {
        if (element.payload.doc.data().postID === this.postID) {
          this.author = await this.getAuthor(element.payload.doc.data().userID);
          this.comments.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
            author: this.author,
          });
          this.sortComments();
        }
      });
    });
  }

  async getAuthor(userID: string): Promise<string> {
    this.authorData = await this.dataService.getCommentAuthor(userID);
    return this.authorData.username;
  }

  sortComments() {
    this.comments.sort((a: any, b: any) => {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    });
  }
}
