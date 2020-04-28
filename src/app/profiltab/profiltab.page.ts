
import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../auth.service';
import {MusicserverService} from '../musicserver.service';
import {Song,Album} from '../interfaces/song';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { PremiumPage } from '../premium/premium.page';
import {ListenpopovPage} from '../listenpopov/listenpopov.page';
import { File } from '@ionic-native/file/ngx';
import {NavController,ModalController,PopoverController,AlertController} from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-profiltab',
  templateUrl: './profiltab.page.html',
  styleUrls: ['./profiltab.page.scss'],
})
export class ProfiltabPage implements OnInit {
  public songs:Array<any>=[];
  public prenom:string="";
  public nom:string="";
  public mail:string="";
  public viewMode:string="horsligne";
  public paymentype:string="";
  public prixtot:number=0;
  public isshowed:boolean=true;
  public clicked:boolean=false;
  song: Song;
  delayId: any;
  delay: number=1500;
  public iconame:string="volume-high";
  
  
  constructor( public auth:AuthService,
    public musicserver:MusicserverService,
    private nativeStore:NativeStorage,public file:File,
    public popoverCtrl:PopoverController,
    public modalCtrl:ModalController,
    private platform:Platform) {
    
     }

  async ngOnInit() {
    this.nom=this.auth.user.nom
    this.prenom=this.auth.user.prenom
    this.mail=this.auth.user.mail
  await this.musicserver.checkAudiofiles();
  this.auth.retrieveDownloads();
 // this.song= this.musicserver.getSong(this.musicserver.attente,this.musicserver.song.id);
  //this.song.isplayed=true;



  let iconsname=["volume-mute","volume-high"]
  let i=0
  var that=this;
  this.delayId=setInterval(function(){
    that.iconame=iconsname[i] 
 //   console.log(that.iconame)
    i++;
    if(i===2){
      i=0
    }
   
   },this.delay)
  
  }
  
 showd(){
   this.clicked=!this.clicked;
 }
  async updateusercredts(){
   // console.log("pseudo",this.pseudo)
   this.isshowed=false;
   this.auth.user.prenom= await this.prenom;
   this.auth.user.nom= await this.nom;
   this.auth.user.mail= await this.mail;
  await  this.auth.updateusercredt(this.auth.user)
  
  }
  async aleatory(){
     let ctr = this.musicserver.dirSongs.length;
      let temp;
      let index;
  
      // While there are elements in the array
      while (ctr > 0) {
        
  // Pick a random index
          index = Math.floor(Math.random() * ctr);
  // Decrease ctr by 1
  ctr--; 
  // And swap the last element with it
          temp = this.musicserver.dirSongs[ctr];
          this.musicserver.dirSongs[ctr] = this.musicserver.dirSongs[index];
          this.musicserver.dirSongs[index] = temp;

    }
 
    await  this.musicserver.getsongfromoffline( this.musicserver.dirSongs[0])
  
  
  
  
  }
 async normal(){
   
    await  this.musicserver.getsongfromoffline( this.musicserver.dirSongs[0])
   
 }
  async aleatoryf(){
    let ctr = this.auth.favorites.length;
    let temp;
    let index;
  
    // While there are elements in the array
    while (ctr > 0) {
  // Pick a random index
        index = Math.floor(Math.random() * ctr);
  // Decrease ctr by 1
        ctr--;
  // And swap the last element with it
        temp = this.auth.favorites[ctr];
        this.auth.favorites[ctr] = this.auth.favorites[index];
        this.auth.favorites[index] = temp;
  
  }
  await  this.auth.verifylimitlistensfavoritepage( this.auth.favorites[0].id)
  
  }
  

  
 
  redownload(song){
    if(song.type==="Album"){
      this.musicserver.redownloadalb(song)
    }
    else if(song.type==="Single"){
      this.musicserver.redownload(song)
    }
  }
  presentAlertPremium(user){
    if(!user.ispremium){
      this.presentModal()
    }else{
      this.auth.presentAlertPremium(user)
    }
  
    }
    async presentModal() {
      const mod = await this.modalCtrl.create({
        component: PremiumPage
      });
      mod.onDidDismiss()
      .then(async (data) => {
        console.log("dismiss data",data['data']);
         if(true === data['data']){
          this.auth.user.ispremium=true;
        await  this.auth.startpremium(this.auth.user)
        
         }
    });
      return await mod.present();
    }
    
    async presentListenPop(ev,song:any) {
      event.stopPropagation()
      const pop = await this.popoverCtrl.create({
        component: ListenpopovPage,
        translucent: true,
        componentProps:{data:song}
      });
     this.musicserver.fromviewMode=this.viewMode;

      return await pop.present();
    }
   
    
   
  

    show(){
      this.isshowed=!this.isshowed;
    }
  async ngOnDestroy(){
    clearInterval(this.delayId); 
   
  }
 
 
  doRefresh(event) {
    this.musicserver.directories=[];
    this.musicserver.dirSongs=[];
    console.log('Begin async operation');
    this.musicserver.checkAudiofiles();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
