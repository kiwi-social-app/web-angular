import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, User } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  @Output() onLogIn: EventEmitter<any> = new EventEmitter();

  logInForm!: FormGroup;

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.logInForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  logIn() {
    this.dataService
      .logIn(this.logInForm.getRawValue())
      .subscribe((response: any) => {
        if (response.auth) {
          localStorage.setItem('currentUser', response.token);
          this.router.navigate(['/']);
        }
      });
  }
}
