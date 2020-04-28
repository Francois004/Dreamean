import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiledattentePage } from './filedattente.page';

const routes: Routes = [
  {
    path: '',
    component: FiledattentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiledattentePageRoutingModule {}
