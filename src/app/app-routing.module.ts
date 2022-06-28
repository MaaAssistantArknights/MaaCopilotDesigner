import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './copilot/componments/home/home.component';

const routes: Routes = [{path:'',redirectTo:'maacopilotdesigner',pathMatch:'full'},
{path:'/maacopilotdesigner',component: HomeComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
