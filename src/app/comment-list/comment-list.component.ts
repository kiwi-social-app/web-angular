import { Component, OnInit } from '@angular/core';
import { Comment } from '../services/comment.model';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  comments: Comment[] = [];
  public postID: string;
  public author!: any;

  constructor(private dataService: DataService, private route: ActivatedRoute) {
    this.postID = String(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.dataService.getAllComments().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element.payload.doc.data().postID === this.postID) {
          this.comments.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          });
          this.getAuthor(element.payload.doc.data().userID);
        }
      });
    });
  }

  getAuthor(userID: string) {
    this.dataService.getCommentAuthor(userID).then((authorData: any) => {
      this.author = authorData.username;
    });
  }
}
