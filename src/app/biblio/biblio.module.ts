import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from "@angular/forms";
import { BiblioPageRoutingModule } from './biblio-routing.module';

import { BiblioPage } from './biblio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,

    BiblioPageRoutingModule
  ],
  declarations: [BiblioPage]
})
export class BiblioPageModule {}
