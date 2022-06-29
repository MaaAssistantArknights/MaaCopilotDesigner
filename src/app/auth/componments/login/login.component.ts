import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  form: FormGroup;
  public role: string = '';

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    public messageService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.role) {
      this.role = data.role;
      this.form = this.fb.group({
        email: ['', Validators.email],
        password: ['', Validators.required],
        role: ['', Validators.required],
        user_name: ['', Validators.required]
      });
    } else {
      this.role = '';
      this.form = this.fb.group({
        email: ['', Validators.email],
        password: ['']
      });
    }

  }
  submit(forgetPass = false) {
    if (this.form.invalid) {
      this.messageService.error("邮件格式错误")
    }
    else {
      this.dialogRef.close({ type: (forgetPass ? 'forgetpass' : ''), value: this.form.value });
    }
  }
}
