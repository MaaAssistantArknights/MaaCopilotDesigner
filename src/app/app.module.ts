import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionComponent } from './copilot/componments/action/action.component';
import { OperatorComponent } from './copilot/componments/operator/operator.component';
import { SearchCopilotComponent } from './copilot/componments/search-copilot/search-copilot.component';
import { HomeComponent } from './copilot/componments/home/home.component';
import { MaterialExampleModule } from './shared/material.module';
import { CopilotDetailComponent } from './copilot/componments/copilot-detail/copilot-detail.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/componments/login/login.component';
import { AuthService } from './auth/services/auth.service';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    ActionComponent,
    OperatorComponent,
    SearchCopilotComponent,
    HomeComponent,
    CopilotDetailComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialExampleModule,
    DragDropModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
