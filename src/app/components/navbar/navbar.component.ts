import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}

  logout() {
    this.afAuth.signOut();
  }

  collapseMenu() {
    this.isCollapsed === true
      ? (this.isCollapsed = false)
      : (this.isCollapsed = true);
  }
}
