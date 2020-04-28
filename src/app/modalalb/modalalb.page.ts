import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import {NavController,ModalController,PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-modalalb',
  templateUrl: './modalalb.page.html',
  styleUrls: ['./modalalb.page.scss'],
})
export class ModalalbPage implements OnInit {

  constructor(public musicserver:MusicserverService,public modalCtrl:ModalController,public popCtrl:PopoverController) { }

  ngOnInit() {
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.popCtrl.dismiss({
      'dismissed': true
    });
  }
}
