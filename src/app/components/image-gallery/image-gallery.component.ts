import { Component, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent {
  private readonly storage: Storage = inject(Storage);
  images: string[] = [];
  currentUserId!: string;
  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.afAuth.authState.subscribe((user) => {
      listAll(ref(this.storage, `${user?.uid}/images`))
        .then((res) => {
          res.prefixes.forEach((folderRef) => {});
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef).then((url) => {
              this.images.push(url);
            });
          });
        })
        .catch((error) => {});
    });
  }

  uploadFile(input: HTMLInputElement) {
    if (!input.files) return;
    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        this.auth.afAuth.authState.subscribe((user) => {
          if (user) {
            this.currentUserId = user.uid;
            const storageRef = ref(
              this.storage,
              `${this.currentUserId}/images/${
                file.name
              }_${new Date().getTime()}`
            );
            uploadBytesResumable(storageRef, file);
          }
        });
      }
    }
  }
}
