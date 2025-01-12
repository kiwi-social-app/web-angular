import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data.service';
import {Post} from '../services/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  @Output() onNewPost: EventEmitter<Post> = new EventEmitter();

  newPostForm!: FormGroup;
  newPost!: Post;
  loading: boolean = false;
  success: boolean = false;
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private fireStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    this.initialiseForm();
    console.log(
      this.fireStore.doc(
        'users/' +
          this.afAuth.onAuthStateChanged((user: any) => {
            return user.id;
          })
      )
    );
    console.log(this.afAuth.currentUser);
    console.log(this.afAuth.credential);
    console.log(this.afAuth.user);
  }

  initialiseForm(): void {
    this.newPostForm = this.fb.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]],
      image: null,
      // userRef: this.fireStore.doc(
      //   'users/' +
      //     this.afAuth.onAuthStateChanged((user: any) => {
      //       return user.id;
      //     })
      // ),
    });
  }

  createPost() {
    this.dataService.createPost(this.newPostForm.getRawValue());
    this.router.navigate(['/post-list']);
  }
}
