import { Component, inject } from '@angular/core';
import {
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  private readonly storage: Storage = inject(Storage);

  selectedFile!: File;
  task!: AngularFireUploadTask;
  percentage!: Observable<any>;
  snapshot!: Observable<any>;
  downloadUrl!: Observable<string>;

  uploadFile(input: HTMLInputElement) {
    if (!input.files) return;
    const files: FileList = input.files;
    console.log(files)
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, file.name);
        uploadBytesResumable(storageRef, file);
      }
    }
  }
}
