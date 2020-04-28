import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import {AuthService} from '../auth.service';
import {NavController,ModalController,PopoverController,AlertController} from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit {
  public article:any;
  constructor(public musicserver:MusicserverService,public auth:AuthService,public nav:NavController) { }

  async ngOnInit() {
    if(this.musicserver.idarticle){
      console.log("idarticle,",this.musicserver.idarticle)
      this.article= await this.musicserver.getArticle(this.musicserver.articless,this.musicserver.idarticle);
      //this.musicserver.article=await this.article;
     
    }
  }
  dismiss(){
    this.nav.navigateBack('/tabs/gossip')
  }

}
