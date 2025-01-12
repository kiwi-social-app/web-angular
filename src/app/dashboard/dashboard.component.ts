import { Component, OnInit } from '@angular/core';
import { DataService, User } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: User[] = [];

  constructor(
    // public auth: AuthService,
    private dataService: DataService) {}

  ngOnInit(): void {}
}
