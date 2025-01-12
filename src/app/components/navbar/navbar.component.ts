import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Auth } from '@angular/fire/auth';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean = true;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public afAuth: Auth
  ) {}

  ngOnInit(): void {}

  collapseMenu() {
    this.isCollapsed
      ? (this.isCollapsed = false)
      : (this.isCollapsed = true);
  }
}
