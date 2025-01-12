import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AngularFireStorage,
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

  constructor(private http: HttpClient) // private storage: AngularFireStorage
  {}

  uploadFile(input: HTMLInputElement) {
    if (!input.files) return;
    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(this.storage, file.name);
        uploadBytesResumable(storageRef, file);
      }
    }
  }

  // startUpload(event: FileList) {
  //   const file = event.item(0);

  //   if (file?.type.split('/')[0] !== 'image') {
  //     console.error('Unsupported file type');
  //     return;
  //   }

  //   const path = `test/${new Date().getTime()}_${file.name}`;

  //   const customMetadata = { app: 'chatter app' };

  //   this.task = this.storage.upload(path, file, { customMetadata });

  //   this.percentage = this.task.percentageChanges();
  //   this.snapshot = this.task.snapshotChanges();
  //   // this.downloadUrl = this.task.downloadURL();
  // }

  // isActive(snapshot : any) {
  //   return (
  //     snapshot.state === 'running' &&
  //     snapshot.bytesTransferred < snapshot.totalBytes
  //   );
  // }

  // onFileSelected(event: any) {
  //   this.selectedFile = <File>event.target.files[0];
  // }

  // onUpload() {
  //   const fd = new FormData();
  //   fd.append('image', this.selectedFile, this.selectedFile.name);
  //   this.http.post('', fd).subscribe((res) => {
  //     console.log(res);
  //   });
  // }
}
