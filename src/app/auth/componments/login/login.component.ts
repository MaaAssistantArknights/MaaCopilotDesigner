import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    public messageService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }
  login(){    
    if(this.form.invalid){
      this.messageService.error("邮件格式错误")
    }
    else{
      this.dialogRef.close(this.form.value);
    }

  }

}
