import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import { Subscription } from 'rxjs';
import {AuthService } from '../auth.service';

@Component({
  selector: 'app-gossip',
  templateUrl: './gossip.page.html',
  styleUrls: ['./gossip.page.scss'],
})
export class GossipPage implements OnInit {
  articleSubscription: Subscription;
  public articles:any

  constructor(public musicserver:MusicserverService,public auth:AuthService) { }

  ngOnInit() {
    this.articleSubscription=this.musicserver.getArticles().subscribe((value)=>{
      this.articles=value;
      this.musicserver.articless=value;
    });
    //this.auth.updateallarticles(this.auth.user,this.musicserver.articless)
  }
  ngOnDestroy(){
    this.articleSubscription.unsubscribe();
   
   }
}
