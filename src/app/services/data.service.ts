import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Comment } from './comment.model';
import { Post } from './post.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  currentUser!: any;

  constructor(private auth: AuthService, private fireStore: AngularFirestore) {
    this.currentUser = this.auth.getCurrentUser();
  }

  public getAllPosts(): Observable<any> {
    return this.fireStore.collection('posts').snapshotChanges();
  }

  public getPostByID(id: string): any {
    return this.fireStore
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
    return this.fireStore.collection('posts').add(post);
  }

  public deletePost(id: string) {
    return this.fireStore.collection('posts').doc(id).delete();
  }

  public createComment(comment: Comment, postID: string) {
    comment.userID = this.auth.currentUser.uid;
    comment.postID = postID;

    return this.fireStore.collection('comments').add(comment);
  }

  public getPostAuthor(userID: string) {
    return this.fireStore
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
    return this.fireStore
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
    return this.fireStore
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

  public getAllComments(): any {
    return this.fireStore.collection('comments').snapshotChanges();
  }

  public getUserData(userID: any): any {
    return this.fireStore
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
    return this.fireStore.collection('user').doc(userID).update(user);
  }
}
