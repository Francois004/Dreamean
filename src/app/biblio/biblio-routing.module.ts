import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiblioPage } from './biblio.page';

const routes: Routes = [
  {
    path: '',
    component: BiblioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiblioPageRoutingModule {}
