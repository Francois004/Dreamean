import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MusicserverService} from '../musicserver.service';
import {AuthService} from '../auth.service';
import {Song,Album} from '../interfaces/song';
import {NavController,ModalController,PopoverController,AlertController} from '@ionic/angular';
import { ModalalbPage } from '../modalalb/modalalb.page';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { PanierPage } from '../panier/panier.page';

@Component({
  selector: 'app-albdetails',
  templateUrl: './albdetails.page.html',
  styleUrls: ['./albdetails.page.scss'],
})
export class AlbdetailsPage implements OnInit {
  public album:any;
  public song:any;
  albumsCollection: AngularFirestoreCollection<Album>;
  public downloading:boolean=false;
  public delay:number=1500;
  public delayId:any;
  public iconame:string="volume-high";
  isplayed:boolean=false;

  constructor(private route: ActivatedRoute,public musicserver:MusicserverService,
    public nav:NavController,public auth:AuthService,
    public modalCtrl: ModalController,public popCtrl:PopoverController,public alertCtrl:AlertController) { }

 async ngOnInit() {
   /* let id = await this.route.snapshot.paramMap.get('idalbum');
   [routerLink]="['/albdetails/', album.id]"
    */

if (this.musicserver.idalbum) {
  console.log("idalbum",this.musicserver.idalbum);
  this.album= await this.musicserver.getAlbum(this.musicserver.albumss,this.musicserver.idalbum);
  await this.musicserver.getalbumsongs(this.album)


this.musicserver.album=await this.album;
this.musicserver.attente=this.album.songs
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

  }

  goback(){
    this.nav.navigateBack('/tabs/acceuil');
  }
  downloads(album:Album){
  if(this.auth.user.ispremium){
    this.auth.downloads.push(album)
    this.auth.user.fordownloads.push(album.id)
    let index=this.auth.user.downloadeds.indexOf(album.id)
    if(index=-1){
      this.auth.user.downloadeds.push(album.id)
      this.musicserver.downloadalb(album)
    }
    else{
      this.musicserver.redownloadalb(album)
    }
    this.auth.usersavedownload(this.auth.user)
    for(let song of album.songs){
      song.downloading=true
    } 
  }else{
    this.auth.userstartdownload(this.auth.user,album)
  }
  
   
  }
  async presentCart() {
    const mod = await this.modalCtrl.create({
      component: PanierPage
    });
    mod.onDidDismiss()
    .then((data) => {
      console.log("dismiss cart data",data['data']);
       if(true === data['data']){
         for (let song of this.auth.cart){
           this.auth.user.fordownloads.push(song.id)
           song.downloading=true;
           if(song.type=="Single"){
           this.musicserver.download(song)
          }else{
            this.musicserver.downloadalb(song)
          }
          this.musicserver.directories.push(song)
         }
         this.auth.usersavedownload(this.auth.user)
      
       }
  });
  this.auth.userstartdownload(this.auth.user,this.musicserver.album)
    return await mod.present();
  }
async presentPop(ev:any) {
  const pop = await this.popCtrl.create({
    component: ModalalbPage,
    event: ev,
    translucent: true
  });
  return await pop.present();
}

async presentAlert(msg:any,msg1:any,msg2:any) {
  const alert = await this.alertCtrl.create({
    header: 'Téchargement réussi',
    subHeader: msg +' de '+ msg1 + ' est dans ',
    message: msg2,
    buttons: ['OK']
  }); 
  await alert.present();
  }
  download(song:Song){
    if (this.auth.user.ispremium){
      this.auth.user.fordownloads.push(song.id)
      this.auth.downloads.push(song)
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
  async playorpause(album){
   let index;
   if(this.musicserver.song){
    index=album.ids.indexOf(this.musicserver.song.id)
   }
   else{
     index=-1;
   }
   

    if(!album.isplayed&&index==-1){

      //stop music playing
      if(this.musicserver.song||this.musicserver.filemedia){
        if (this.musicserver.song.isplayed)
        this.musicserver.song.isplayed=false;
        this.musicserver.filemedia.pause();
        this.musicserver.filemedia.stop();
       this.musicserver.filemedia.release();
        this.musicserver.showsongbar=false;
        clearInterval(this.musicserver.get_position_interval);
        this.musicserver.position = 0;
        this.musicserver.display_duration="-:-"
        this.musicserver.display_position="00.00"
       
        this.musicserver.is_ready=false;
        this.musicserver.initisong=true;
       
       }
    
      this.musicserver.song=await album.songs[0]
      await this.musicserver.getDuration(this.musicserver.song)
     this.musicserver.play(this.musicserver.song)
    
   
    }else if(index!=-1&&!this.musicserver.is_playing){
 this.musicserver.play(this.musicserver.song)

    }
    else{
      this.musicserver.pause(this.musicserver.song);
     
    
    }
  
    
  }


  async aleatory(){
    if(this.musicserver.offline){
     let ctr = this.musicserver.album.songs.length;
      let temp;
      let index;
     for(let index of this.musicserver.album.indexs){
       this.musicserver.dirSongs.splice(index,1)
     }

      while (ctr > 0) {
        
          index = Math.floor(Math.random() * ctr);
     ctr--; 

          temp = this.musicserver.album.songs[ctr];
          this.musicserver.album.songs[ctr] = this.musicserver.album.songs[index];
          this.musicserver.album.songs[index] = temp;
          
    } 
    for(let song of this.musicserver.album.songs){
      this.musicserver.dirSongs.unshift(song)
    }
     
    await  this.musicserver.getsongfromoffline( this.musicserver.dirSongs[0])
  
  }
  else{
    let ctr = this.musicserver.album.songs.length;
    let temp;
    let index;
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = this.musicserver.album.songs[ctr];
        this.musicserver.album.songs[ctr] =this.musicserver.album.songs[index] ;
        this.musicserver.album.songs[index] = temp;

  }
 await  this.musicserver.getsongfromalbum(0,this.musicserver.album.id)

  }
}
  ngOnDestroy(){
    clearInterval(this.delayId); 
    this.musicserver.fromsongbar=false;
  }
}
