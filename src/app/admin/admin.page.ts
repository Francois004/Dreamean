import { Component, OnInit, ValueSansProvider } from '@angular/core';
import {MusicserverService} from '../musicserver.service';
import {Song,Album} from '../interfaces/song';
import { LoadingController,AlertController,ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {Article} from '../interfaces/article';
import * as _ from "lodash";
import { async } from 'q';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public dateobj=new Date();
  public song:Song={
    id:"",
    titre: "",
    downloads:0,
    listens: 0,
    artiste:"",
    imgurl:"",
    songurl:"",
    isrepeat:false,
    islooped:false,
    feats:"",
    credits:"",
    categorie:"",
    file:null,
    weekdownloads:0,
    progress:0,
    downloading:false,
    idalbum:"",
    isplayed:false,
    isliked:false,
    isvalidate:false,
    likes:0,
    downloaded:false,
    duration:"",
    type:"Titre",
    seconds:0,
    isalbumsong:false,
    prix:300,
    created:new Date(),
    createdAt: this.dateobj.getUTCDay()+"/"+this.dateobj.getUTCMonth()+ 1 + "/"+this.dateobj.getFullYear()

  };
  public albsong:Song={
    id:"",
    titre: "",
    downloads:0,
    listens: 0,
    artiste:"",
    imgurl:"",
    songurl:"",
    feats:"",
    credits:"",
    file:null,
    weekdownloads:0,
    progress:0,
    downloading:false,
    isvalidate:false,
    idalbum:"",
    isplayed:false,
    islooped:false,
    isliked:false,
    isrepeat:false,
    likes:0,
    downloaded:false,
    duration:"",
    seconds:0,
    isalbumsong:false,
    type:"Titre",
    categorie:"",
    prix:300,
    created:new Date(),
    createdAt: this.dateobj.getUTCDay()+"/"+this.dateobj.getUTCMonth()+ 1 + "/"+this.dateobj.getFullYear()

  };
  public album:Album={
    id:"",
    titre: "",
    downloads:0,
    artiste:"",
    imgurl:"",
    categorie:"",
    islooped:false,
    isrepeat:false,
    isplayed:false,
    weekdownloads:0,
    songs:[],
    downloading:false,
    downloaded:false,
    isvalidate:false,
    ids:[],
    prix:1000,
    progress:0,
    showed:false,
    type:"Album",
    createdAt: this.dateobj.getUTCDay()+"/"+this.dateobj.getUTCMonth()+ 1 + "/"+this.dateobj.getFullYear()

  };
  public article:Article={
    titre:"",
    contenu:"",
    imgurl:"",
    liked:false,
    likes:0,
    created:new Date(),
    sees:0,
    createdAt:this.dateobj.getUTCDay()+"/"+this.dateobj.getUTCMonth()+ 1 + "/"+this.dateobj.getFullYear()
  }
  selectedFiles: FileList;
  selectedall: FileList;
  ctaudio: Song;
  ctimg:Song;
  ctcover:Song;
  fileaud:any;
  fileimg:any;
  filecover:any;
  ctaudioalb: Song;
  songfile:any;
 
  i=-1;
  currentAlbum:Album;
  public songsCollection:AngularFirestoreCollection<Song>;
  public albumsCollection:AngularFirestoreCollection<Album>;
  public articlesCollection:AngularFirestoreCollection<Article>;
  public songs:Array<Song>;
  attributes:Array<number> = [];
  values:Array<Song> = [];  
  customAlertOptions: any = {
    header: 'Catégorie',
    subHeader: '',
    message: 'diversifiez pour un acceuil dynamique'
  };


  
  constructor(private db:AngularFirestore,public musicserver:MusicserverService,public loadingCtrl:LoadingController,
    public toast:ToastController,
    private afs: AngularFirestore) { 
      this.songsCollection = db.collection<Song>('singles');
      this.albumsCollection=db.collection<Album>('albums');
      this.articlesCollection=db.collection<Article>('articles')
  }
  

  ngOnInit() {
  }
  detectaudio(event) { //song audio
    this.selectedFiles = event.target.files;
    this.fileaud=this.selectedFiles.item(0); 
}
detectfile(event){
  var that=this;
  this.selectedFiles = event.target.files;
  this.songfile=this.selectedFiles.item(0); 
  /*let reader = new FileReader();
    reader.readAsDataURL(this.songfile);
    reader.onload = function () {
      //me.modelvalue = reader.result;
      console.log(reader.result.toString().split(',')[1]);
      that.musicserver.theurl=reader.result.toString();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };*/
}
detectimage(event) {// song  and article img 
  this.selectedFiles = event.target.files;
  this.fileimg=this.selectedFiles.item(0); 
}
detectcover(event) { //album img
  this.selectedFiles = event.target.files;
  this.filecover=this.selectedFiles.item(0); 
}

 async upAlbum(){

  this.ctaudioalb=new Song(this.songfile);  
 this.musicserver.uploadaudio(this.ctaudioalb).then(async (url)=>{
  this.albsong.songurl=await url
  this.albsong.imgurl=await this.album.imgurl
  this.albsong.isalbumsong=await true
 // this.song.idalbum=this.album.id
  this.addalbumsong(this.albsong)
 
 })

    }
    async uploadAlbum(){
     
      const loading = await this.loadingCtrl.create({
        message: 'Saving Song..'
      });
    
      await loading.present();
    
        this.ctcover=new Song(this.filecover)
     this.musicserver.uploadimg(this.ctcover).then(async(url: string)=>{
    console.log("i enter img section")
          this.album.imgurl=url;
        
          
        loading.dismiss();
    })
  }

  async upSong() {
    //let file = this.selectedFiles.item(0);
    
    this.ctaudio=new Song(this.fileaud);  
   // console.log("fileaudio",this.fileaud.type);
   // console.log("fileimg",this.fileimg.type);
    this.ctimg=new Song(this.fileimg);   
    const loading = await this.loadingCtrl.create({
      message: 'Saving Song..'
    });
    await loading.present();
  
  
  this.musicserver.uploadaudio(this.ctaudio).then((url)=>{
    this.song.songurl=url;
    this.musicserver.uploadimg(this.ctimg).then((url)=>{
    //  this.song.id=this.afs.createId()
      this.song.imgurl=url;
      loading.dismiss();
      this.addsong(this.song);
     
    })
  })
 
  }
    
  addalbumsong(song:Song){
    this.songsCollection.add(song).then((ref)=>{
     // console.log(ref.id);
      this.songsCollection.doc(ref.id).update({
        id:ref.id
      }).then(()=>{
        console.log("song uploaded",ref.id)
        this.album.ids.push(ref.id)
        console.log(this.album.ids)
       this.presentToast();
      },err=> this.presentToastE(err))
    },err=>{
     // conso
      this.presentToastE(err);
    })
  }
saveAlbum(album:Album){
  this.addalbum(album)
 
}
  addsong(song:Song){
    this.songsCollection.add(song).then((ref)=>{
      console.log(ref.id);
      this.songsCollection.doc(ref.id).update({
        id:ref.id
      }).then(()=>{
        this.presentToast();
      },err=> this.presentToastE(err))
    },err=>{
     // console.log(err)
      this.presentToastE(err);
    })
  }
  async presentToast() {
    const toast = await this.toast.create({
      message: 'son ajouté avec succès!',
      duration: 3000
    });
    toast.present();
  }
  async presentToastE(err) {
    const toast = await this.toast.create({
      message: 'Erreur uploading!'+ err,
      duration: 3000
    });
    toast.present();
  }
  addalbum(album:Album){
  //  let id=this.afs.createId();
    this.albumsCollection.add(JSON.parse(JSON.stringify(album))).then((ref)=>{
    //  console.log("album",JSON.parse(JSON.stringify(album)))
     console.log(ref.id);

      this.albumsCollection.doc(ref.id).update({
        id:ref.id
      }).then(()=>{
        //this.album.id=ref.id
        this.presentToast();
      },err=> this.presentToastE(err))
   },err=>{
     // console.log(err)
      this.presentToastE(err);
    })
  }
 


  //article
async addarticle(article:Article){
  const loading = await this.loadingCtrl.create({
    message: 'Saving Song..'
  });
  await loading.present();
  this.ctimg=new Song(this.fileimg); 
  this.articlesCollection.add(JSON.parse(JSON.stringify(article))).then((ref)=>{
    //  console.log("album",JSON.parse(JSON.stringify(album)))
     console.log(ref.id);
this.musicserver.uploadimg(this.ctimg).then((url)=>{

  this.articlesCollection.doc(ref.id).update({
    id:ref.id,
    imgurl:url
  }).then(()=>{
    loading.dismiss()
    this.presentToast();
  },err=> {
    loading.dismiss()
    this.presentToastE(err)})
})
   },err=>{
     // console.log(err)
     loading.dismiss()
      this.presentToastE(err);
     
    })
  }

}
