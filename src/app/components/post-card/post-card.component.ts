import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { Post } from '../../models/post.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class PostCardComponent implements OnInit {
  @Input() post!: Post;

  private userService: UserService = inject(UserService);

  protected author: Observable<User | undefined> = of();

  ngOnInit() {
    this.author = this.userService.getUserByID(this.post.authorId);
  }
}
