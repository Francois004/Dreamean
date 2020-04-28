import { Component, OnInit } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import {AuthService} from '../auth.service';
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import {Song,Album} from '../interfaces/song';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-biblio',
  templateUrl: './biblio.page.html',
  styleUrls: ['./biblio.page.scss'],
})
export class BiblioPage implements OnInit {
  public searchControl: FormControl;
  public titles:Array<Song>;
  public artists:Array<Song>;
  public artistsfromalbum:Array<Album>;
  public titlesfromalbum:Array<Album>
  searching: any = false;
  searchTerm:string="";
  blank: any=false;
  public songSubscription:Subscription;
 

  public albums:Array<Album>;
  public albumSubscription:Subscription;
  constructor(public musicserver:MusicserverService,public nav:NavController,public auth:AuthService) {
    this.searchControl = new FormControl();
   }

  async ngOnInit() {
   
   this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(async search => {

    this.searching = false;
   // console.log(search);
    this.titles=this.filterTitles(search);
  //  this.musicserver.searchtitles= await this.titles;
    this.titlesfromalbum=this.filtertitresfromalbum(search);
    this.musicserver.attente=this.titles;
   // console.log(this.items);
    this.searchTerm=search;
    if((search=="")||(search.length<=2)){
      this.blank=false;
    }
    else{
      this.blank=true;

     
    }

});
//this.auth.setrecentlistens();
}
ngOnDestroy(){
//this.auth.setrecentsearch(this.searchTerm,this.auth.user);
}
 
onSearchInput(){

    this.searching = true;

    
}
  filterTitles(searchTerm) {
    return this.musicserver.singles.filter(item => {
      return ((item.titre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 )||(item.artiste.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1));
    });
  }
  
  filtertitresfromalbum(searchTerm) {
    return this.musicserver.albumss.filter(item => {
      return ((item.artiste.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)||(item.titre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1));
    });
  }
  ionViewWillEnter(){
    this.auth.userviewlistens()
  }
 

  
}
