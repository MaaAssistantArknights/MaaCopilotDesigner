import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './copilot/componments/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'maacopilotdesigner', pathMatch: 'full' },
  { path: 'maacopilotdesigner/:activeToken', component: HomeComponent },
  { path: 'maacopilotdesigner', component: HomeComponent },
  { path: '**', redirectTo: 'maacopilotdesigner', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
