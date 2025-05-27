import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostCreation } from '../../../models/postCreation.model';

@Component({
  selector: 'app-new-post-modal',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-post-modal.component.html',
  styleUrl: './new-post-modal.component.scss',
  standalone: true,
})
export class NewPostModalComponent implements OnInit {
  protected readonly data: { userId: string } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef: MatDialogRef<NewPostModalComponent> = inject(
    MatDialogRef<NewPostModalComponent>,
  );
  private readonly fb: FormBuilder = inject(FormBuilder);

  newPostForm!: FormGroup;
  newPost!: PostCreation;

  ngOnInit() {
    this.initialiseForm();
  }

  protected initialiseForm(): void {
    this.newPostForm = this.fb.group({
      body: ['', [Validators.required]],
    });
  }

  protected confirm() {
    this.newPost = this.newPostForm.getRawValue();

    this.dialogRef.close(this.newPost);
  }
}
