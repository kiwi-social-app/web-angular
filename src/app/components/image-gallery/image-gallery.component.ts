import { Component, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent {
  private readonly storage: Storage = inject(Storage);
  listRef = ref(this.storage, 'images');
  images: string[] = [];

  ngOnInit() {
    listAll(this.listRef)
      .then((res) => {
        console.log(res);
        res.prefixes.forEach((folderRef) => {
        });
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef)
          .then(url => {
            this.images.push(url);
          })
        });
      })
      .catch((error) => {

      });
  }

  uploadFile(input: HTMLInputElement) {
    if (!input.files) return;
    const files: FileList = input.files;
    console.log(this.storage);
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        const storageRef = ref(
          this.storage,
          `images/${file.name}_${new Date().getTime()}`
        );
        uploadBytesResumable(storageRef, file);
      }
    }
  }
}
