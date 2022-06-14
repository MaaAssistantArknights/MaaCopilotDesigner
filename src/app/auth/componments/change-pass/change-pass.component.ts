import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePassComponent>,
    public messageService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.form = this.fb.group({
      original_password: ['', Validators.required],
      new_password: ['', Validators.required]
    });
  }
  login() {
    if (this.form.invalid) {
      this.messageService.error("输入错误")
    }
    else {
      this.dialogRef.close(this.form.value);
    }

  }
}
