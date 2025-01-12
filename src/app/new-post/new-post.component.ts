import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService, Post } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

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
  constructor(private dataService: DataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.newPostForm = this.fb.group({
      id: [{ value: uuidv4(), disabled: true }],
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      image: null,
    });
  }

  createPost() {
    this.dataService.createPost(this.newPostForm.getRawValue()).subscribe((response) => response);
  }

}
