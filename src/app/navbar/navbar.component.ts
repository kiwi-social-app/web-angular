import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  // login() {
  //   this.auth.loginWithPopup();
  // }
  // logout() {
  //   this.auth.logout({ returnTo: this.document.location.origin });
  // }
}
