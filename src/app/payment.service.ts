import { Injectable } from '@angular/core';
import {MusicserverService } from './musicserver.service';
import { AuthService } from './auth.service';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';


export enum ConnectionStatus {
  Online,
  Offline
}
@Injectable({
  providedIn: 'root'
})


export class PaymentService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Online);
  constructor(public network: Network, public toastController: ToastController, public plt: Platform,public musicserver:MusicserverService ) {
  
   
     this.network.onDisconnect().subscribe(async () => {
      console.log('network was disconnected :-(');
      this.musicserver.offline=true;
      let toast = this.toastController.create({
        message: `Vous êtes maintenant déconnecté`,
        duration: 2000,
        position: 'top'
      });
      toast.then(toast => toast.present());
    // await this.musicserver.checkAudiofiles();
    });
    
   
    
    // watch network for a connection
     this.network.onConnect().subscribe(() => {
      console.log('network connected!');
     
      let toast = this.toastController.create({
        message: `Vous êtes maintenant connecté`,
        duration: 2000,
        position: 'top'
      });
      if(this.musicserver.offline)
      toast.then(toast => toast.present());
      this.musicserver.offline=false
    }); 
    
    
  }
   
 
  
}
