import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import {Song,Album} from '../interfaces/song';
import { Subscription } from 'rxjs';
import { LoadingController,MenuController, Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { PaymentService, ConnectionStatus } from '../payment.service';



@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.page.html',
  styleUrls: ['./acceuil.page.scss'],
})
export class AcceuilPage implements OnInit {
  public songsd:Array<Song>;
  public songsr:Array<Song>;
  public songdSubscription:Subscription;
  public songrSubscription:Subscription;
  public outSubscription:Subscription;
  public songsc:Array<Song>;
  public songcSubscription:Subscription;
  public albums:Array<Album>;
  public albumSubscription:Subscription;
  public loading;
  public delayId:any;
  slideOpts = {
    initialSlide:0,
    loop:false,
    slidesPerView:2.5,
    spaceBetween:7,
     centeredSlides:false,
      slidesPerGroup:1,
     centerInsufficientSlides:true
  }; 
  greatslideOpts={
    initialSlide:1,
    loop:true,
    slidesPerView:2,
     centeredSlides:true,
      slidesPerGroup:1,
      spaceBetween:7,
    //  autoplay:true,
     centerInsufficientSlides:true
  }
  constructor(public musicserver:MusicserverService,public auth:AuthService,public payment:PaymentService,
    public nav:NavController,
    public loadingCtrl:LoadingController,public platform:Platform) { 
     
    }

  ngOnInit() {
  //this.presentLoading();
  this.songdSubscription=this.musicserver.getSongsBydownloads().subscribe((value)=>{
    this.songsd=value;
    this.musicserver.singlesd=value;
   // this.loading.dismiss();
  });
  this.songcSubscription=this.musicserver.getSongsBycreatedAt().subscribe((value)=>{
    this.songsc=value;
    this.musicserver.singlesc=value;
   // this.loading.dismiss();
  });
  this.songrSubscription=this.musicserver.getSongsFordiscover().subscribe((value)=>{
    this.songsr=value;
    this.musicserver.singlesr=value;
   // this.loading.dismiss();
  });
  /*this.albumSubscription=this.musicserver.getAlbums().subscribe(async (value)=>{
    this.albums=value;
    this.musicserver.albumss=await value;
   // this.musicserver.si=value;
  

  
  
  });*/
 //if(this.songsd&&this.songsc&&this.albums)
 //this.loading.dismiss();
  if(this.musicserver.singles&&this.musicserver.albumss){
    this.auth.userviewdownloads(this.auth.user);
    this.auth.userviewfavorites(this.auth.user);
   
   
   }
 
 if(this.auth.user.ispremium){
 this.auth.verifypremium(this.auth.user)
 }
 
}



 
 

ngOnDestroy(){
 this.songdSubscription.unsubscribe();
 this.songcSubscription.unsubscribe();
 //this.albumSubscription.unsubscribe();
 
}
async presentLoading() {
  this.loading = await this.loadingCtrl.create({
    spinner: 'circles',
    message: 'Patientez...',
    translucent: true,
    cssClass: 'custom-class custom-loading'
  });
  return await this.loading.present();
}

  
 /* ionViewDidEnter(){
    this.outSubscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
}

ionViewWillLeave(){
    this.outSubscription.unsubscribe();
}
*/
}
