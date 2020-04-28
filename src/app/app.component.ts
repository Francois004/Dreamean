import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './auth.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {PaymentService, ConnectionStatus} from './payment.service';
import {MusicserverService} from './musicserver.service';
import { NavController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
//import { PowerManagement } from '@ionic-native/power-management/ngx';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
}) 
export class AppComponent {
  navigate : any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService:AuthService,
    public payment:PaymentService,
    public musicserver:MusicserverService,
    public backgroundMode: BackgroundMode,
    public nav:NavController,
    public nativeStorage:NativeStorage,
  // public androidPermissions: AndroidPermissions,
    //private power: PowerManagement
    
  ) {
   
    this.initializeApp();
   
  }

  
  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    
       this.backgroundMode.setDefaults({ silent: true });
       this.backgroundMode.enable();
      
      this.backgroundMode.on("deactivate").subscribe(async ()=>{
        this.musicserver.isbackground=false;
  
          console.log("disabled") 
        
        });
          
      
 
  
 
 

  this.backgroundMode.on("activate").subscribe(async ()=>{
    this.musicserver.isbackground=true;
    this.backgroundMode.disableWebViewOptimizations();
      
      this.backgroundMode.disableBatteryOptimizations();
 
    });
    
 
  
  
  this.nativeStorage.getItem('store').then((store)=>{
    if((store!=null)&&(store.user!=undefined)){
      this.authService.user=store.user;
      this.musicserver.user=store.user;
      if(!this.musicserver.offline){
        this.nav.navigateRoot('tabs/acceuil');
      }
      else{
        this.nav.navigateRoot('tabs/profiltab');
      }
      
    }

  }).catch((error)=>{
    console.log(error);
  
    this.nav.navigateRoot('signup');
  })
 



  })
     
    
  }


 
}
