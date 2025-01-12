import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { User } from '../services/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  currentUser!: User;

  constructor(public auth: AuthService, private dataService: DataService) {}

  ngOnInit(): void {  }
}
