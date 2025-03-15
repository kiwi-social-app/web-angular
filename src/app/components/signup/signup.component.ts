import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  protected signupForm!: FormGroup;
  protected firebaseErrorMessage: string = '';

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  protected signup(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.authService.signupUser(this.signupForm.value).then((result) => {
      if (result == null) {
        this.router.navigate(['/signup']);
      } else if (result.isValid == false) {
        this.firebaseErrorMessage = result.message;
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
