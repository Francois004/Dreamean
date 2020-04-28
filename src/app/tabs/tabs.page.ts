import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(public musicserver:MusicserverService, public nav:NavController) { }

  ngOnInit() {
  }
  goto(){
    this.musicserver.fromsongbar=true;
    this.nav.navigateForward('/songdetails');
  }
  async stop(){
    this.musicserver.showsongbar=false;
    this.musicserver.isuserstoppedsong=true;
    this.musicserver.stop();
   await  this.musicserver.musicControls.destroy()
  }
  pause($event){
    $event.stopPropagation();
    this.musicserver.pause(this.musicserver.song);
  }
  play($event){
    $event.stopPropagation();
    this.musicserver.play(this.musicserver.song);
  }
}
