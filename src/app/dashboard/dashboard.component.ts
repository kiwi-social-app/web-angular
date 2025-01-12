import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { User } from '../services/user.model';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  currentUser!: any;

  constructor(public auth: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.auth.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = this.dataService
          .getUserData(user.uid)
          .then((userData: any) => {
            this.currentUser = userData;
          });
      }
    });
  }
}
