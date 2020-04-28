import { Component, OnInit } from '@angular/core';
import {MusicserverService } from '../musicserver.service';
import { AuthService } from '../auth.service';
import { NavParams} from '@ionic/angular';
import {NavController,ModalController,PopoverController} from '@ionic/angular';
@Component({
  selector: 'app-listenpopov',
  templateUrl: './listenpopov.page.html',
  styleUrls: ['./listenpopov.page.scss'],
})
export class ListenpopovPage implements OnInit {
  public song:any;
 // public indexsong:number;

  constructor(public musicserver:MusicserverService,public auth:AuthService,public navParams:NavParams,public popCtrl:PopoverController) {
    this.song= this.navParams.get('data');
  // console.log("data:",this.song)
   }

  ngOnInit() {
  }
  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.popCtrl.dismiss({
      'dismissed': true
    });
  }
  async listenafter(){
    if(this.song.type=='Single')
   await this.musicserver.listenafter(this.song)
    this.dismiss()
  }
  async reup(){
    if(this.song.type=='Single')
    await this.auth.repeatsong(this.song)
     this.dismiss()
   }
   async loop(){
     if(this.song.type=='Single')
    await this.auth.loopsong(this.song)
     this.dismiss()
   }
   


   async delete(){
     if(this.musicserver.fromviewMode==='horsligne'){
      await this.deletefromdownloads();
     }
     else if(this.musicserver.fromviewMode==='favoris'){
      await this.deletefromfavorites();
     }
     else if(this.musicserver.isattente){
       await this.deletefromattente();
     }
     this.dismiss()
   }



   async deletefromdownloads(){
      
     
      let index=this.musicserver.directories.indexOf(this.song)
       let ind=await this.auth.user.fordownloads.indexOf(this.song.id)
       let indexx=this.musicserver.dirSongs.indexOf(this.song)
       this.auth.user.fordownloads.splice(ind,1)
       this.musicserver.directories.splice(index,1)
       this.musicserver.dirSongs.splice(indexx,1)
       await this.auth.usersavedownload(this.auth.user)
       if(this.song.type=='Single'){
        await this.musicserver.deleteFile(this.song.f)
        this.musicserver.getSong(this.musicserver.singles,this.song.id).downloaded=false;
       }
       else{
        let album= await this.musicserver.getAlbum(this.musicserver.albumss,this.song.id);
        album.downloaded=false;
        for(let song of album.songs){
          // this.musicserver.deleteFile(song.f)
           this.musicserver.getSong(this.musicserver.singles,song.id).downloaded=false;
        }
        for(let fs of this.musicserver.dirSongs){
        //  this.musicserver.deleteFile(fs.f) 
        
          if(fs.idalbum===this.song.id ){
             this.musicserver.deleteFile(fs.f)
          }
  
        }
      }
     
    

   }



   deletefromfavorites(){
   
      let ind=this.auth.user.favoritessong.indexOf(this.song.id)
      let index=this.auth.favorites.indexOf(this.song)
      this.auth.user.favoritessong.splice(ind,1)
      this.auth.favorites.splice(index,1)
     
       this.musicserver.getSong(this.musicserver.singles,this.song.id).downloaded=false;
     
      this.auth.usersavefavoritesongs(this.auth.user)

   }





async deletefromattente(){
  if(this.musicserver.offline){
      
    let ind=await this.musicserver.dirSongs.indexOf(this.song)
    this.musicserver.dirSongs.splice(ind,1)
  
 }
 else{
  let ind=await this.musicserver.attente.indexOf(this.song)
  this.musicserver.attente.splice(ind,1)


 }
}



}
