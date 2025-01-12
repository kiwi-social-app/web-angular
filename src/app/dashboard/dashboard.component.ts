import { Component, OnInit } from '@angular/core';
import { DataService, User } from '../data.service';
import {AuthService} from '@auth0/auth0-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: User[] = [];

  constructor(public auth: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
console.log(this.auth.user$)
  }
}
