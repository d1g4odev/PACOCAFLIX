import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import {MatFormFieldModule} from '@angular/material/form-field'


const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  }
];


@NgModule({
  declarations: [
    
  ],
  imports: [
    MatFormFieldModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginRoutingModule { }
