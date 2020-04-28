import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import {PaymentService} from '../payment.service';
import {NavController} from '@ionic/angular';
import { AuthService } from '../auth.service';
import {Song,Album} from '../interfaces/song';
import { LoadingController,AlertController,ToastController,ModalController } from '@ionic/angular'
import { PanierPage } from '../panier/panier.page';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-songdetails',
  templateUrl: './songdetails.page.html',
  styleUrls: ['./songdetails.page.scss'],
})
export class SongdetailsPage implements OnInit {
  [x: string]: any;
  public song:any;
  


  constructor(public musicserver:MusicserverService,public auth:AuthService,public payment:PaymentService,public toast:ToastController,
    public nav:NavController,public modalCtrl:ModalController,public platform:Platform) { 
      this.backButtonEvent();
    }

  async ngOnInit() {
   if(!this.musicserver.fromsongbar){
    if(this.musicserver.idsong){
      this.musicserver.song= await this.musicserver.getSong(this.musicserver.singles,this.musicserver.idsong);

      await this.musicserver.getDuration(this.musicserver.song)
       await this.setAttente()
     
    }
   else if(this.musicserver.isalbumsong){
  //   console.log("indexsong",this.musicserver.indexsong)
    this.musicserver.song=await this.musicserver.album.songs[this.musicserver.indexsong]
    //this.musicserver.song=await this.song;
   await this.musicserver.getDuration(this.musicserver.song)
    this.musicserver.attente=this.musicserver.album.songs
    }
    else {
     
    await this.musicserver.getDuration(this.musicserver.song)
    this.musicserver.attente=this.musicserver.dirSongs;
    }
   
  await   this.musicserver.play(this.musicserver.song)
 // this.setAttente()
   // this.musicserver.subsong=await this.musicserver.getSong(this.musicserver.singles,this.musicserver.song.id);
  }
  }





  goback(){
    //this.nav.navigateBack('');
   // this.location.back();
  }
  async ngOnDestroy() {
   this.musicserver.fromsongbar=false;
   
  }




  forward(){
   
    if(this.musicserver.isalbumsong){
      this.musicserver.forwardsong(this.musicserver.song,this.musicserver.album.songs)
    }
    else{
     
      this.musicserver.forwardsong(this.musicserver.song,this.musicserver.attente)
      console.log(this.musicserver.attente)
    }
  }


  backward(){
    if(this.musicserver.isalbumsong){
      this.musicserver.backwardsong(this.musicserver.song,this.musicserver.album.songs)
    }
    else{
      this.musicserver.backwardsong(this.musicserver.song,this.musicserver.attente)
    }
  }



  async presentCart() {
    const mod = await this.modalCtrl.create({
      component: PanierPage
    });
    mod.onDidDismiss()
    .then(async (data) => {
      console.log("dismiss cart data",data['data']);
       if(true === data['data']){
         for (let song of this.auth.cart){
           let ined=this.auth.user.payeds.indexOf(song.id)
           let indx=this.auth.user.fordownloads.indexOf(song.id)
         
          if(ined==-1){
         await   this.auth.user.payeds.push(song.id)
          }
          if(indx==-1){
            await   this.auth.user.fordownloads.push(song.id)
             }
         
            
        
          
           if(song.type=="Single"){
         await  this.musicserver.download(song)
         this.delete(song)

          }else{
           await this.musicserver.downloadalb(song)
           this.delete(song)
          }
          song.isvalidate=true;
          this.musicserver.directories.push(song)
         }
         this.auth.usersavedownload(this.auth.user)
      
       }
  });
    return await mod.present();
  }





  download(song:Song){
    if(this.auth.user.ispremium){
      let ind =this.auth.user.fordownloads.indexOf(song.id)
      if(ind==-1){
        this.auth.user.fordownloads.push(song.id)
      }
    
    
    let index=this.auth.user.downloadeds.indexOf(song.id)
    if (index==-1){
      this.auth.user.downloadeds.push(song.id)
      this.musicserver.download(song)
    }
    else{
      this.musicserver.redownload(song)
    }
     
     
      this.auth.usersavedownload(this.auth.user)
   }
    else{
      this.auth.userstartdownload(this.auth.user,song)
    }
   
   
  }


  delete(song){
    this.auth.prixtot-=song.prix;
    let pos=this.auth.cart.indexOf(song)
    this.auth.cart.splice(pos,1)
   
  } 

  setAttente(){
     if(this.musicserver.isfavorite&&!this.musicserver.offline){
      this.musicserver.attente=this.auth.favorites;
    }
    else{
      let indexd= this.musicserver.singlesd.findIndex(song=>song.id==this.musicserver.idsong)
      let indexr=this.musicserver.singlesr.findIndex(song=>song.id==this.musicserver.idsong)
     // let indexc=this.musicserver.singlesc.findIndex(song=>song.id==this.musicserver.idsong)

      if(indexd!==-1){
        this.musicserver.attente=this.musicserver.singlesd
       
      }
      else if(indexr!==-1){
        this.musicserver.attente=this.musicserver.singlesr
       
      }
      else{
        this.musicserver.attente=this.musicserver.singlesc
       
      }
       

    }
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
        // close action sheet
        try {
            console.log("Android hardware back button detected!")
          //  this.goback();
        
        } catch (error) {
        }
      })
    }
    
      
}

