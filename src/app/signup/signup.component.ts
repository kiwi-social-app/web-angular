import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, User } from '../data.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @Output() onSignUp: EventEmitter<User> = new EventEmitter();

  signUpForm!: FormGroup;
  newUser!: User;
  loading: boolean = false;
  success: boolean = false;

  constructor(private dataService: DataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.signUpForm = this.fb.group({
      id: [{ value: uuidv4(), disabled: true }],
      username: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

  }

  signUp() {
    this.dataService.signUp(this.signUpForm.getRawValue()).subscribe((response) => console.log(response))
  }
}
