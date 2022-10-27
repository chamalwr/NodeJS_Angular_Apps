import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorsRoutingModule } from './authors-routing.module';
import { AuthorsComponent } from './authors.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AuthorsComponent
  ],
  imports: [
    CommonModule,
    AuthorsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
  providers: [
    NgbActiveModal
  ]
})
export class AuthorsModule { }
