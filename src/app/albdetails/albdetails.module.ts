import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlbdetailsPageRoutingModule } from './albdetails-routing.module';
import { ModalalbPageModule} from '../modalalb/modalalb.module';
import { AlbdetailsPage } from './albdetails.page';
import { PanierPageModule} from '../panier/panier.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlbdetailsPageRoutingModule,
    ModalalbPageModule,
    PanierPageModule
  ],
  declarations: [AlbdetailsPage]
})
export class AlbdetailsPageModule {}
