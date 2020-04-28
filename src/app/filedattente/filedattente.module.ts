import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiledattentePageRoutingModule } from './filedattente-routing.module';

import { FiledattentePage } from './filedattente.page';
import { ListenpopovPageModule} from '../listenpopov/listenpopov.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiledattentePageRoutingModule,
    ListenpopovPageModule
  ],
  declarations: [FiledattentePage]
})
export class FiledattentePageModule {}
