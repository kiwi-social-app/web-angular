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

  async getComments() {
    await this.dataService
      .fetchComments()
      .subscribe((data) => this.buildComments(data));
  }

  async buildComments(data: any) {
    data.forEach(async (element: any) => {
      if (element.postID === this.postID) {
        const author = await this.getAuthor(element.userID);
        const data = element;
        this.comments.push({ author, ...data });
      }
    });
  }

  async getAuthor(userID: string): Promise<string> {
    this.authorData = await this.dataService.getCommentAuthor(userID);
    return this.authorData.username;
  }
}
