import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map, mergeMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  currentUser!: any;

  constructor(private auth: AuthService, private afs: AngularFirestore) {}

  public checkImage(imageData: any) {
    if (
      imageData === null ||
      imageData === undefined ||
      imageData.length === 0
    ) {
      return '../../assets/placeholder.png';
    } else {
      return imageData;
    }
  }

  public fetchPosts(): Observable<any> {
      return this.afs
      .collection('posts', (ref) => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        mergeMap((snapshots) => {
          return snapshots.map((snapshot) => {
            const data: any = snapshot.payload.doc.data();
            const id = snapshot.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  public getPostByID(id: string): any {
    return this.afs
      .collection('posts')
      .doc(id)
      .ref.get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  public createPost(post: Post) {
    post.userID = this.auth.currentUser.uid;
    post.createdAt = new Date();
    post.image = this.checkImage(post.image);
    return this.afs.collection('posts').add(post);
  }

  public updatePost(postID: string, post: Post) {
    post.image = this.checkImage(post.image);
    return this.afs.collection('posts').doc(postID).update(post);
  }

  public deletePost(id: string) {
    return this.afs.collection('posts').doc(id).delete();
  }

  public createComment(comment: Comment, postID: string) {
    comment.userID = this.auth.currentUser.uid;
    comment.postID = postID;
    comment.createdAt = new Date();

    return this.afs.collection('comments').add(comment);
  }

  public getPostAuthor(userID: string) {
    return this.afs
      .collection('user')
      .doc(userID)
      .ref.get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
          return;
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  public getCommentAuthor(userID: string) {
    return this.afs
      .collection('user')
      .doc(userID)
      .ref.get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
          return;
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  public getAuthor(userID: string, collection: string) {
    return this.afs
      .collection(collection)
      .doc(userID)
      .ref.get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
          return;
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  public fetchComments(): Observable<any> {
    return this.afs
      .collection('comments', (ref) => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        mergeMap((snapshots) => {
          return snapshots.map((snapshot) => {
            const data: any = snapshot.payload.doc.data();
            const id = snapshot.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  public getUserData(userID: any): any {
    return this.afs
      .collection('user')
      .doc(userID)
      .ref.get()
      .then(function (doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  public updateUser(userID: string, user: User) {
    return this.afs.collection('user').doc(userID).update(user);
  }
}
