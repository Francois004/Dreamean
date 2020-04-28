import { Component, OnInit } from '@angular/core';
import {Song,Album} from '../interfaces/song';
import {MusicserverService } from '../musicserver.service';
import {ListenpopovPage} from '../listenpopov/listenpopov.page';
import {NavController,ModalController,PopoverController,AlertController} from '@ionic/angular';

@Component({
  selector: 'app-filedattente',
  templateUrl: './filedattente.page.html',
  styleUrls: ['./filedattente.page.scss'],
})
export class FiledattentePage implements OnInit {
  public attente:Array<Song>;
  public song:Song;
  public delay:number=1500;
  public delayId:any;
  public iconame:string="volume-high";
  public i:number=0;
  //popoverCtrl: any;

  constructor(public musicserver:MusicserverService,public popoverCtrl:PopoverController) { }

  ngOnInit() {
   
   this.musicserver.isattente=true;
  
    this.song= this.musicserver.getSong(this.musicserver.attente,this.musicserver.song.id);
    this.song.isplayed=true;
  
  
  
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
  async presentListenPop(ev,song:any) {
    event.stopPropagation()
    const pop = await this.popoverCtrl.create({
      component: ListenpopovPage,
      translucent: true,
      componentProps:{data:song}
    });
   

    return await pop.present();
  }
  async play(song){
    this.song.isplayed=false;
  await this.musicserver.stop();
  this.musicserver.initisong=true;
  this.musicserver.song=await song
  await this.musicserver.getDuration(this.musicserver.song);
  this.musicserver.play(this.musicserver.song)
  song.isplayed=true;
  }
   
   ngOnDestroy(){
    clearInterval(this.delayId); 
    this.musicserver.isattente=false;
  }
}
