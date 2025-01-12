import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  firebaseErrorMessage!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  signup() {
    if (this.signupForm.invalid) {
      return;
    }

    this.authService
      .signupUser(this.signupForm.value)
      .then((result) => {
        if (result == null) {
          this.router.navigate(['/signup']);
        } else if (result.isValid == false) {
          this.firebaseErrorMessage = result.message;
        }
      })
      .catch(() => {});
  }
}
