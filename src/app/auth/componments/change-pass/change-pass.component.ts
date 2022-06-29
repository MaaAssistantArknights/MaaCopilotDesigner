import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent {
  form!: FormGroup;
  changePass: boolean = false;
  public optionList: any[];

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePassComponent>,
    public messageService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.optionList = [{ "name": "修改用户名", "value": false }, { "name": "修改密码", "value": true }]
    this.changePass = (data.type == "password");
    this.setForm();
  }
  save() {
    if (this.form.invalid) {
      this.messageService.error("输入错误")
    }
    else {
      this.dialogRef.close({ changePass: this.changePass, value: this.form.value });
    }

  }
  setForm() {
    if (this.changePass) {
      this.form = this.fb.group({
        original_password: ['', Validators.required],
        new_password: ['', Validators.required]
      });
    }
    else {
      this.form = this.fb.group({
        user_name: [''],
        email: ['', Validators.email]
      });
    }
  }
  handleChange(event: any) {
    this.changePass = event.value
    this.setForm();
  }
}


