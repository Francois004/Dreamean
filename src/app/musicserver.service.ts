import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import * as firebase from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import {Song,Album} from './interfaces/song';
import { LoadingController,AlertController,ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { MediaObject, Media } from '@ionic-native/media/ngx';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Article } from './interfaces/article';
import { lastIndexOf } from 'lodash';
//import {AuthService} from './auth.service';
import { User } from '../app/interfaces/user';
import { WebView } from '@ionic-native/ionic-webview/ngx';
//import {LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { AdMobFree,AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';



@Injectable({
  providedIn: 'root'
})
export class MusicserverService {
  backInt(backInt: any) {
    throw new Error("Method not implemented.");
  }
  public songsd:Observable<any[]>;
  public songsc:Observable<any[]>;
  public songsr:Observable<any[]>;
  public allsongs:Observable<any[]>;
  public albums:Observable<any[]>;
  public nalbums:Observable<any[]>;
  
  public articles:Observable<any[]>;
 public fileTransfer: FileTransferObject ;
 public filemedia:MediaObject;
 public singles:Array<any>;
 public users:Array<any>;
 public allalbums:Array<any>;
 public albumsongs:Array<any>;
 public thearticles:Array<any>;
 public song :any;
 public subsong:any;
 public subalbum:any;
  songsCollection: AngularFirestoreCollection<Song>;
 albumsCollection: AngularFirestoreCollection<Album>;
 usersCollection: AngularFirestoreCollection<User>;
 public songurl:string;
 public loading;
 //download vars
 public albumss:Array<any>;
 public articless:Array<any>;
 public idalbum:any;
 public idsong:any;
 public idarticle:any;
 public indexsong:any;
 public isalbumsong:boolean=false;
 public album:any;
 public downloading:boolean=false;
 public downloaded:boolean=false;
 //player variables
 duration: any = -1;
  get_duration_interval: any;
  curr_playing_file: any;
  display_duration: string='00.00 ';
  is_playing: boolean;
  is_ready: boolean;
  isuserpaused:boolean;
  initisong:boolean;
  get_position_interval: any;
  position: any;
  display_position: string='00.00';
  fromsongbar:boolean=false;
  i=-1;
  listenchrono:number=0;
  verifylisten:boolean=true;
  //file d'attente
 isattente:boolean;
  public idattente:number;
  public attente:Array<any>;
  public singlesc:Array<any>=[];
  public singlesd:Array<any>=[];
  public singlesr:Array<any>=[];
  public searchtitles:Array<Song>;
  public isuserstoppedsong:boolean; 
  public showsongbar:boolean;
  public isdownload:boolean=true;
  public indexOn:number;
  //offline vars
  public offline:boolean=false;
  public idOff:number;
  public indexOf:number;
  public dirEntries:Array<any>=[];
  public directories:Array<any>=[];
  public dirSongs:Array<any>=[];
 
  //page vars
  isfavorite:boolean;
  fromviewMode:string="";

  //user vars
  public user:User;
  recents:Array<any>=[];
  //background vars
  isbackground:boolean=false;
  backInterval:any;
  backtimer:number=0;
  constructor(private db:AngularFirestore,private afstorage:AngularFireStorage, private platform:Platform,public file: File, 
    public alertController: AlertController,public loadingCtrl:LoadingController,public toast:ToastController,public natStore:NativeStorage,
  public transfer: FileTransfer,public nav:NavController,private media:Media,public webview:WebView, public backgroundMode: BackgroundMode,
  /*public lcNotifs:LocalNotifications*/ public musicControls:MusicControls,public admob:AdMobFree
  ) { 
    //this.usersCollection = db.collection<User>('users');
    this.platform.ready().then(()=>{
      this.launchInterstitial();
    })
  
    this.songsCollection = db.collection<Song>('singles');
    this.albumsCollection= db.collection<Album>('albums');
   
    //all songs
     this.db
    .collection<Song>('singles')
    .snapshotChanges().pipe(map(singles=> {
      return singles.map(single=> {
        const data = single.payload.doc.data();
        const id = single.payload.doc.id;
        return { id, ...data };
      });
  })).subscribe((value)=>{
    this.singles=value
  });
//top  téléchargés
    this.songsd = this.db
    .collection<Song>('singles',ref => ref.orderBy('downloads','desc').limit(7))
    .snapshotChanges().pipe(map(singles=> {
      return singles.map(single=> {
        const data = single.payload.doc.data();
        const id = single.payload.doc.id;
        return { id, ...data };
      });
  }));
  //récents
  this.songsc = this.db
    .collection<Song>('singles',ref => ref.orderBy('created','desc').where("isalbumsong","==",false).limit(7))
    .snapshotChanges().pipe(map(singles=> {
      return singles.map(single=> {
        const data = single.payload.doc.data();
        const id = single.payload.doc.id;
        return { id, ...data };
      });
  }));

  //A decouvrir
  this.songsr = this.db
    .collection<Song>('singles',ref => ref.orderBy('created','desc').where("categorie","==","decouverte").limit(7))
    .snapshotChanges().pipe(map(singles=> {
      return singles.map(single=> {
        const data = single.payload.doc.data();
        const id = single.payload.doc.id;
        return { id, ...data };
      });
  }));
//all albums
 this.db
.collection<Album>('albums')
.snapshotChanges().pipe(map(albums=> {
  return albums.map(album=> {
    const data = album.payload.doc.data();
    const id = album.payload.doc.id;
    return { id, ...data };
  });
})).subscribe((value)=>{
  this.albumss=value
});
//New albums
/*this.nalbums= this.db
.collection('albums',ref => ref.orderBy('created','desc'))
.snapshotChanges().pipe(map(albums=> {
  return albums.map(album=> {
    const data = album.payload.doc.data();
    const id = album.payload.doc.id;
    return { id, ...data };
  });
}));*/
this.articles=this.db
.collection<Article>('articles')
.snapshotChanges().pipe(map(articles=> {
  return articles.map(article=> {
    const data = article.payload.doc.data();
    const id = article.payload.doc.id;
    return { id, ...data };
  });
}))

 
  }
getSong(songs,idsong) : Song{
  return songs.find(song=> song.id===idsong);
}
getAllsongs(){
  return this.allsongs;
}
  getSongsBydownloads(){
    return this.songsd;
  }
  getSongsBycreatedAt(){
    return this.songsc;
  }
  getSongsFordiscover(){
    return this.songsr;
  }
  getAlbums(){
    return this.albums;
  } 
  getnewAlbums(){
    return this.nalbums;
  } 

  getAlbum(albums,idalbum) : Album{
    return albums.find(album=> album.id===idalbum);
}
getdetailsforalbum(idalbum:string){
  let indx=this.directories.findIndex(album=>album.id==idalbum)
  if(indx!=-1){
    this.getsongfromoffline(this.directories[indx])
  }
  else{
    this.isdownload=false;
  this.idalbum= idalbum
 
   this.nav.navigateForward('/albdetails');
  }
  this.subalbum= this.getAlbum(this.albumss,idalbum);
  

 }
 getalbumsongs(album:Album){
   for (let id of album.ids){
     let song=this.singles.find(song=>song.id===id)
     if(album.songs.indexOf(song)===-1)
       album.songs.push(song)
   }
 }
 async getdetailsforsong(idsong:string){
  this.showInterstitial() 
 
    if(this.filemedia||this.song){
   
  
      if (this.song.isplayed)
      this.song="";
      this.filemedia.pause();
      this.filemedia.stop();
     this.filemedia.release();
      this.showsongbar=false;
      clearInterval(this.get_position_interval);
      this.position = 0;
      this.display_duration="-:-"
      this.display_position="00.00"
     
      this.is_ready=false;
      this.initisong=true;
     
    
  

  }
 
  
  this.isalbumsong=false
   this.idalbum="";
   this.album="";
   this.indexsong="";
  this.isdownload=false;
  this.isfavorite=false;
  this.idsong= idsong;
   this.nav.navigateForward('/songdetails');
  


 }
 
async getdetailsforsongfromfavoritepage(idsong:string){
 
  if(this.filemedia||this.song){
  
 
   if (this.song)
   this.song="";
   this.filemedia.pause();
   this.filemedia.stop();
  this.filemedia.release();
   this.showsongbar=false;
   clearInterval(this.get_position_interval);
   this.position = 0;
   this.display_duration="-:-"
   this.display_position="00.00"
  
   this.is_ready=false;
   this.initisong=true;
  
 }
 
 this.isalbumsong=false
 this.idalbum="";
 this.album="";
 this.indexsong="";
 this.isdownload=false;
 this.isfavorite=true;
 this.idsong= idsong;
  this.nav.navigateForward('/songdetails');


}
 async getsongfromoffline(song){    //offline mode
 
 
  this.isdownload=true;
  
 try {
  this.idsong=""
  
 
  
  if(song.type=='Single'){
    this.isalbumsong=false;
    if(this.song||this.filemedia){
      if (this.song.isplayed)
      this.song.isplayed=false;
      this.filemedia.pause();
      this.filemedia.stop();
     this.filemedia.release();
      this.showsongbar=false;
      clearInterval(this.get_position_interval);
      this.position = 0;
      this.display_duration="-:-"
      this.display_position="00.00"
     
      this.is_ready=false;
      this.initisong=true;
     
     }
    

      this.song=await song;
    if(song.idalbum!=""){
      
    }

 
   await this.nav.navigateForward('/songdetails');
}else{
  this.idalbum="";
  this.checkalbumsingles(song)
  await this.nav.navigateForward('/albdetails');
}
 } catch (error) {
   console.log(error) 
  }

 }
 
 getsongfromalbum(index:number,id:string){
   
 
  if(index==this.indexsong&&this.idalbum==id&&this.isalbumsong){
    this.fromsongbar=true;
   }
   else{
    if(this.filemedia||this.song){
   
  
      if (this.song.isplayed)
      this.song.isplayed=false;
      this.filemedia.pause();
      this.filemedia.stop();
     this.filemedia.release();
      this.showsongbar=false;
      clearInterval(this.get_position_interval);
      this.position = 0;
      this.display_duration="-:-"
      this.display_position="00.00"
     
      this.is_ready=false;
      this.initisong=true;
     
    }

   }
 
   this.indexsong=index
   this.idsong=""
   this.idalbum=id;
   this.isalbumsong=true;
   this.nav.navigateForward('/songdetails');
  // console.log("ms indexsong",this.indexsong)

 }
 getdetailsforarticle(idarticle:string){
  this.idarticle= idarticle
   this.nav.navigateForward('/article');
  
 }
 getArticle(articless,idarticle):Article{
  return articless.find(article=> article.id===idarticle);
 }
getArticles(){
  return this.articles;
}
  ///Notifications
  /*showNotif(fo){
   
    this.lcNotifs.schedule({
      id:1,
      title:fo.titre,
      text: fo.artiste,
      priority:2,
      lockscreen:true,
      sticky:true,
      foreground:false,
      autoClear:true,
     // autoCancel:false,
     // smallIcon:'res://stop-circle.svg',
      icon:fo.imgurl,
      actions: [
       { id: 'stop',title:'stop'},
        { id: 'backwad',icon:'res://stop-circle.svg' },
        { id: 'forwad',icon:'res://play-circle.svg' },
        { id: 'play',icon:'res://play-circle.svg' },
      ],
    
      

    })
    this.lcNotifs.on('stop').subscribe(async ()=>{
     
     await this.lcNotifs.clear(1)
     this.stop();
    })
    this.lcNotifs.on('forwad').subscribe(async ()=>{
    
    await this.forwardsong(this.song,this.attente);
   
    })
    this.lcNotifs.on('backwad').subscribe(async ()=>{
     
     await this.backwardsong(this.song,this.attente);
     
     })
  }
*/

  



//uploading
  public uploadimg(song: Song) {
    let basePath:string = '/images'
    return new Promise<any>((resolve,reject)=>{ 
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${basePath}/${song.file.name}`).put(song.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        song.progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      (error) => {
        // upload failed
        console.log(error);
        reject(error);
      },
      () => {
        // upload success
  
      resolve(uploadTask.snapshot.ref.getDownloadURL());
       
      }
    );})
  }
    public uploadaudio(song: Song) {
    let basePath:string = '/audios'
    return new Promise<any>((resolve,reject)=>{ 
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${basePath}/${song.file.name}`).put(song.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        song.progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      (error) => {
        // upload failed
        console.log(error);
        reject(error);
      },
      () => {
        // upload success
  
      resolve(uploadTask.snapshot.ref.getDownloadURL());
       
      }
    );})
  }
///////////////////////////////////////////////music listens update
  listensong(song:Song){
  
    this.songsCollection.doc(song.id).update({
      listens:song.listens+1
    }).then(()=>{
      console.log("islisten")
    })
  }


  //downloads functions



  downloadalb(album:Album) {
  this.platform.ready().then(()=>{
  this.i++;
  this.fileTransfer= this.transfer.create();
  album.songs[this.i].downloading=true;
 album.downloading=true;
  this.fileTransfer.download(album.songs[this.i].songurl, this.file.externalDataDirectory + '/' + album.artiste+'&'+album.titre +'*'+album.id+'$'+ album.songs[this.i].titre+'&&'+album.songs[this.i].duration+'&&&'+album.songs[this.i].seconds+'**'+album.songs[this.i].id,true).then((entry) => {
    console.log('download complete: ' + entry.toURL());
  
   album.songs[this.i].downloaded=true;
   this.updateaudio(album.songs[this.i]);
   if(this.i==album.songs.length-1){
     this.updateA(album)
    // this.presentAlert(this.entry)
    album.downloaded=true
  
   }
   else{
     this.downloadalb(album)
     this.downloadcover(album)
   }
  
   
  }, (error) => {
    console.log(error);
    album.songs[this.i].downloading=false;
    album.songs[this.i].downloaded=false;
    
  this.errorAlert(error);
  })
 
  })
  }
  redownloadalb(album:Album) {
    this.platform.ready().then(()=>{
    this.i++;
    this.fileTransfer= this.transfer.create();
    album.songs[this.i].downloading=true;
   album.downloading=true;
    this.fileTransfer.download(album.songs[this.i].songurl,this.file.externalDataDirectory + '/' + album.artiste+'&'+album.titre +'*'+album.id+'$'+ album.songs[this.i].titre+'&&'+album.songs[this.i].duration+'&&&'+album.songs[this.i].seconds+'**'+album.songs[this.i].id,true).then((entry) => {
      console.log('download complete: ' + entry.toURL());
    
     album.songs[this.i].downloaded=true;
     if(this.i==album.songs.length-1){
      album.downloaded=true
     }
     else{
       this.redownloadalb(album)   
       this.downloadcover(album)
     }
    
     
    }, (error) => {
      console.log(error);
      album.songs[this.i].downloading=false;
      album.songs[this.i].downloaded=false;
       
    this.errorAlert(error);
    })
   
    })
    }
 
  
    
   
   updateA(album:Album){
    this.albumsCollection.doc(album.id).update({
      downloads:album.downloads+1
    }).then(function() {
   
  //  this.presentToast()
    },error=>console.log("Problem with updating!",error));
  }

 
 

 /* this.fileTransfer.onProgress((progressEvent) => {
   // console.log(progressEvent);
    this.zone.run(() =>{
      let perc= (progressEvent.lengthComputable) ?  Math.floor(progressEvent.loaded / progressEvent.total * 100) : -1;
    loading.message='Téléchargement en cours... '+ perc+'%'
    });
  
  });*/
  download(song:Song) {
  
    this.platform.ready().then(async()=>{
 
  
      this.fileTransfer= this.transfer.create();
      song.downloading=true;
         this.fileTransfer.download(song.songurl, this.file.externalDataDirectory + '/' + song.artiste+ '&'+ song.titre+'&&'+song.duration+'&&&'+song.seconds+'*'+song.id,true).then((entry) => {
           console.log('download complete: ' + entry.toURL());
          //loading.dismiss();
          song.downloaded=true;
        //  this.presentAlert(entry.toURL());
        this.updateaudio(song);
          this.downloadimg(song)
         }, (error) => {
           console.log(error);
           song.downloading=false;
           song.downloaded=false;
           song.isvalidate=true;
          // loading.dismiss();
         this.errorAlert(error);
         });
    
 
})

  }
  redownload(song:Song) {
  
    this.platform.ready().then(async()=>{
 
  
      this.fileTransfer= this.transfer.create();
      song.downloading=true;
         this.fileTransfer.download(song.songurl, this.file.externalDataDirectory + '/' + song.artiste+ '&'+ song.titre+'&&'+song.duration+'&&&'+song.seconds+'*'+song.id,true).then((entry) => {
           console.log('download complete: ' + entry.toURL());
          //loading.dismiss();
          song.downloaded=true;
        //  this.presentAlert(entry.toURL());
       
          this.downloadimg(song)
         }, (error) => {
           console.log(error);
           song.downloading=false;
           song.downloaded=false;
         
          // loading.dismiss();
         this.errorAlert(error);
         });
    
 
})

  }
  downloadimg(song:any) {
  
    this.platform.ready().then(async()=>{
 
   this.fileTransfer= this.transfer.create();
   song.downloading=true;
   
       this.fileTransfer.download(song.imgurl, this.file.externalDataDirectory +'/'+ song.artiste+ '&'+ song.titre +'&&'+song.duration+'&&&'+song.seconds+'*'+song.id+'.jpg',true).then((entry) => {
       //  console.log('download complete: ' + entry.toURL());
        //loading.dismiss();
        this.downloaded=true;
       
       }, (error) => {
         console.log(error);
         song.downloading=false;
         song.downloaded=false;
       //  song.isvalidate=true;
        // loading.dismiss();
       this.errorAlert(error);
       });
     },
     
   );
   }
   downloadcover(song:any) {
  
    this.platform.ready().then(async()=>{
 
   this.fileTransfer= this.transfer.create();
   song.downloading=true;
   
       this.fileTransfer.download(song.imgurl, this.file.externalDataDirectory + '/' + song.artiste+ '&'+ song.titre+'*'+song.id+'.jpg',true).then((entry) => {
       //  console.log('download complete: ' + entry.toURL());
        //loading.dismiss();
        song.downloaded=true;
       
       }, (error) => {
         console.log(error);
         song.downloading=false;
         song.downloaded=false;
       //  song.isvalidate=true;
        // loading.dismiss();
       this.errorAlert(error);
       });
     },
     
   );
   }
  
  updateaudio(song:Song){
  this.songsCollection.doc(song.id).update({
    downloads:song.downloads+1
  }).then(function() {
    console.log("song was updated");
    console.log("downloads: ",song.downloads)
  },error=>console.log("Problem with updating!",error));
}
updateduration(song:Song){
  this.songsCollection.doc(song.id).update({
    duration:this.display_duration,
    seconds:this.duration
  }).then(function() {
    console.log("song duration was updated");
   // console.log("downloads: ",song.duration)
  },error=>console.log("Problem with updating!",error));
}

 
  async presentAlert(msg:any) {
    const alert = await this.alertController.create({
      header: 'Téléchargement réussi',
      subHeader: '',
      message: 'chemin vers le fichier:' + msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  async errorAlert(error:any) {
    const alert = await this.alertController.create({
      header: 'Erreur',
      subHeader: 'Probleme de téléchargement,réessayer',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Téléchargement réussi!',
      duration: 4000
    });
    toast.present();

  }
  async MusicErrorToast() {
    const toast = await this.toast.create({
      message: 'Erreur de chargement!',
      duration: 4000
    });
    toast.present();

  }




  //offline functions
  
  
  async checkalbumsingles(fo){
    let songs=[];
    let ids=[]
    for(let fsong of this.dirSongs){
      if((fsong.idalbum)===(fo.id)){
        songs.push(fsong);
       
        ids.push(fsong.id)
      }
    }
   
    let album={
      titre:fo.titre,
      artiste:fo.artiste,
      imgurl:fo.imgurl,
      downloads:0,
      isplayed:false,
      downloading:false,
      downloaded:true,
      isrepeat:false,
      islooped:false,
      type:"Album",
      songs:songs,
      ids:ids
    }
    this.album=await album
   // console.log("album",this.album)
    
  }
  public async checkAudiofiles() {
   
    this.platform.ready().then(async()=>{
  

    const baseFolder: string = this.file.externalDataDirectory; 
 

    const exits = await this.file.checkDir(baseFolder, "");
    console.log(`exists: ${exits}`);
   
    
    this.file.listDir(baseFolder, "").then(async (res)=>{
      for (let f of res){
        this.dirEntries.push(f)
  
        if(f.isFile&&(f.name.substring(f.name.lastIndexOf("."),f.name.length)!==".jpg")){
       
          if(f.name.indexOf("$")===-1){
       
        let filename =this.file.externalDataDirectory+ f.name + '.jpg';
    
       
            let fileObj={
              f,
              titre:f.name.substring(f.name.indexOf("&")+1,f.name.indexOf("&&")),
                artiste:f.name.substring(0,f.name.indexOf("&")),
                songurl:this.file.externalDataDirectory.replace(/file:\/\//g,'') + f.name,
                imgurl:(<any>window).Ionic.WebView.convertFileSrc(filename),
                img:filename,
                duration:f.name.substring(f.name.indexOf("&&")+2,f.name.indexOf("&&&")),
                seconds:parseInt(f.name.substring(f.name.indexOf("&&&")+3,f.name.indexOf("*"))),
                id:f.name.substring(f.name.indexOf("*")+1,f.name.length),
                downloaded:true,
                downloading:false,
                 type:"Single",
              isplayed:false,
              isrepeat:false,
              islooped:false,
              isvalidate:false
            }
        let index=this.user.payeds.indexOf(fileObj.id)
         let indx=this.user.fordownloads.indexOf(fileObj.id)
        if(index!==-1){
          fileObj.isvalidate=true
          this.directories.push(fileObj);
          this.dirSongs.push(fileObj);
        }
        else if(indx!==-1){
          this.directories.push(fileObj);
          this.dirSongs.push(fileObj);

        }
           
          }
            else if(this.directories.findIndex(fileobj=>fileobj.f.name.substring(0,fileobj.f.name.indexOf("$")))===-1){
             
              let filename =this.file.externalDataDirectory+ f.name.substring(0,f.name.indexOf("$")) + '.jpg';
              
              let fileObj={
                f,
                titre:f.name.substring(f.name.indexOf("&")+1,f.name.indexOf("*")),
                artiste:f.name.substring(0,f.name.indexOf("&")),
                imgurl:(<any>window).Ionic.WebView.convertFileSrc(filename),
                type:"Album",
                id:f.name.substring(f.name.indexOf("*")+1,f.name.indexOf("$")),
                downloaded:true,
                downloading:false,
                isvalidate:true
              }
            
              let fsong={
                f,
                titre:f.name.substring(f.name.indexOf("$")+1,f.name.indexOf("&&")),
                artiste:f.name.substring(0,f.name.indexOf("&")),
                songurl:this.file.externalDataDirectory.replace(/file:\/\//g,'') + f.name,
                imgurl:(<any>window).Ionic.WebView.convertFileSrc(filename),
                img:filename,
                duration:f.name.substring(f.name.indexOf("&&")+2,f.name.indexOf("&&&")),
                seconds:parseInt(f.name.substring(f.name.indexOf("&&&")+3,f.name.indexOf('**'))),
                type:"Single",
                isplayed:false,
                isrepeat:false,
                islooped:false,
                idalbum:f.name.substring(f.name.indexOf("*")+1,f.name.indexOf("$")),
                id:f.name.substring(f.name.indexOf("**")+2,f.name.length),
                downloaded:true,
                downloading:false,
                isvalidate:true
               
              }
              let index=this.user.payeds.indexOf(fileObj.id)
              let indx=this.user.fordownloads.indexOf(fileObj.id)
             if(index!==-1){
              fileObj.isvalidate=true
              fsong.isvalidate=true
               this.directories.push(fileObj);
               this.dirSongs.push(fsong)
             }
             else if(indx!==-1){
               this.directories.push(fileObj);
               this.dirSongs.push(fsong)
     
             }
             
            
          }
          else{
           
            let filename =this.file.externalDataDirectory+ f.name.substring(0,f.name.indexOf("$")) + '.jpg';
            let fsong={
              f,
              titre:f.name.substring(f.name.indexOf("$")+1,f.name.indexOf("&&")),
              artiste:f.name.substring(0,f.name.indexOf("&")),
              songurl:this.file.externalDataDirectory.replace(/file:\/\//g,'') + f.name,
              imgurl:(<any>window).Ionic.WebView.convertFileSrc(filename),
              img:filename,
              duration:f.name.substring(f.name.indexOf("&&")+2,f.name.indexOf("&&&")),
              seconds:parseInt(f.name.substring(f.name.indexOf("&&&")+3,f.name.length)),
              type:"Single",
              isplayed:false,
              downloaded:true,
              downloading:false,
              isrepeat:false,
              islooped:false,
              idalbum:f.name.substring(f.name.indexOf("*")+1,f.name.indexOf("$")),
              id:f.name.substring(f.name.indexOf("**")+2,f.name.length),
              isvalidate:true
            }
          this.dirSongs.push(fsong)
          let index=this.user.payeds.indexOf(fsong.idalbum)
              let indx=this.user.fordownloads.indexOf(fsong.idalbum )
             if(index!==-1){
              fsong.isvalidate=true
               this.dirSongs.push(fsong)
             }
             else if(indx!==-1){

               this.dirSongs.push(fsong)
     
             }
             
            
          }
        
        }
      }
    }).catch(error=>{console.log(error)})

})
}

deleteFile(file) { 
  
 
  for(let f of this.dirEntries){
    if((file.name+'.jpg'==f.name)||(f.name==( file.name.substring(0,file.name.indexOf("$")) + '.jpg'))){
      f.remove(()=>{console.log("success")},()=>console.log("error"))
    }
  }
  file.remove(()=>{console.log("success")},()=>console.log("error")) 
      
}
 

  //play music functions
  


  async getDuration(song:any) {
    this.platform.ready().then(async ()=>{
     // this.showInterstitial();
      
        if(song.seconds!=0){
          this.setToPlayback(song)
          this.duration=song.seconds;
          this.display_duration=song.duration
    
    
        }
      else{
        this.duration=-1;
        this.filemedia= this.media.create(song.songurl);
        this.filemedia.play()
      this.filemedia.setVolume(0.0);  // you don't want users to notice that you are playing the file
      const self = this;
      // The plugin does not give the correct duration on playback start
      // Need to check for duration repeatedly
      let temp_duration = self.duration;
      this.get_duration_interval = setInterval(async () => {
        if (self.duration === -1 || !self.duration) {
          self.duration = ~~(self.filemedia.getDuration());  // make it an integer
        } else {
          if (self.duration !== temp_duration) {
            temp_duration = self.duration;
          }
          else {
            self.filemedia.stop();
            self.filemedia.release();
  
            clearInterval(self.get_duration_interval);
            this.display_duration = this.toHHMMSS(self.duration);
            self.setToPlayback(song);
          self.updateduration(song)
          }
        }
      }, 100);
       } })
       this.controlMusics(song);
       this.isuserpaused=false;
       this.isuserstoppedsong=false;
       if(!this.offline&&!this.isbackground){
        this.subsong= this.getSong(this.singles,song.id)
       }
     
    
    
  }

 async setToPlayback(song:any) {
  
 
   this.filemedia= this.media.create(song.songurl);
 
    this.filemedia.onStatusUpdate.subscribe(async status => {
      console.log(status)
      switch (status) {
        case 1:    //starting
         // this.stop()
       
          break;
        case 2:   // 2: playing
          this.is_playing = true;
          this.is_ready = true;
          this.musicControls.updateIsPlaying(true);
          this.showsongbar=true;
          break;
        case 3:   // 3: pause
          this.is_playing = false;
          this.musicControls.updateIsPlaying(false);
    
          break;
        case 4:   // 4: stop
       
      
       if(!this.isuserstoppedsong&&!this.initisong){
         this.next();
       }
        break;

        default:
          this.is_playing = false;
          
          break;

      }
      
    });
   
  

  
 
    this.getAndSetCurrentAudioPosition(song);
   
  }
  

  getAndSetCurrentAudioPosition(song:Song) {
    
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval(() => {
      const last_position = self.position;
      self.filemedia.getCurrentPosition().then(async (position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.filemedia.seekTo(last_position * 1000);

          } else {
            // update position for display
            self.position = position;
            this.display_position = this.toHHMMSS(self.position);
          }
         
        } else if (position >= self.duration) {
     //modified stop() function!
     if(!self.offline&&!self.song.downloaded){
           
      let chrono=new Date().getTime()
    
      if((chrono-self.listenchrono)>30000&&this.position>30){
    
        self.listensong(this.song)
      }
    }
    self.isuserstoppedsong=false;
        self.initisong=false;
    if (self.song)
   self.song.isplayed=false;
    if(self.album){
      self.album.isplayed=false;
    }
    self.filemedia.stop();
    self.filemedia.release();
    clearInterval(self.get_position_interval);
    self.position = 0;
    self.display_duration="-:-"
    self.display_position="00.00"
    self.is_ready=false;
    if(!this.offline){
      self.setrecentslisten(song)
    }
        
         
        }
      });
    }, 100);
  }
 

  async play(song) {
  
/*if (!this.offline&&!song.downloaded){
  if(!this.user.ispremium&&this.user.listenssong.length>15){
  this.alertlimitnpremium()
  }
  else{
    this.filemedia.play();
    this.musicControls.updateIsPlaying(true);
    song.isplayed=true;
 
    if(this.album&&(this.isalbumsong=true)){
     this.album.isplayed=true;
   }
    if(!song.downloaded&&!this.user.ispremium){
      this.user.listenssong.push(song.id)
    }
  

  }
  
 }
  else{*/
   this.filemedia.play();
   
   song.isplayed=true;

   if(this.album&&(this.isalbumsong=true)){
    this.album.isplayed=true;
  }
 
//}

this.listenchrono=new Date().getTime();

  
}

  pause(song) {
    if(this.album&&(this.isalbumsong=true)){
      this.album.isplayed=false;
    }
  this.filemedia.pause();
  
  this.isuserpaused=true;
 /* if(!this.offline){
  if(!this.user.ispremium&&!song.downloaded)
    this.user.listenssong.splice(0,1);

  }*/
  
  }

  async stop() {
    if(!this.offline&&!this.song.downloaded){
           
      let chrono=new Date().getTime()
    
      if((chrono-this.listenchrono)>30000&&this.position>30){
    
        this.listensong(this.song)
      }
    }
    
    this.isuserstoppedsong=true;
    if (this.song)
    this.song.isplayed=false;
    if(this.album){
      this.album.isplayed=false;
    }
   // this.filemedia.pause();
    this.filemedia.stop();
   this.filemedia.release();
    this.showsongbar=false;
    
    this.initisong=false;
    
    clearInterval(this.get_position_interval);
    this.position = 0;
    this.display_duration="-:-"
    this.display_position="00.00"
   
    this.is_ready=false;
  
    //this.duration=-1
   /* let index=this.user.recents.findIndex(obj=>obj.id==this.song.id)
    if(index!=-1){
      this.user.recents[index].time++;

    }else{
      let obj={
        id:this.song.id,
        time:1
      }
      this.user.recents.push(obj)
    }*/
   
  }

  controlSeconds(action) {
    const step = 5;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        this.position = numberRange < step ? 0.001 : numberRange - step;
        break;
      case 'forward':
        this.position = numberRange + step < this.duration ? numberRange + step : this.duration;
        break;
      default:
        break;
    }
  }

  

  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i >= 0)
      .join(":")
}
  async next(){
  
    if(this.song.isrepeat){
      this.song.isrepeat=false;
    await  this.getDuration(this.song)
    this.play(this.song)
    }else if(this.song.islooped){
    await  this.getDuration(this.song)
    this.play(this.song)
    }
    else{
   await   this.forwardsong(this.song,this.attente)
    
    
  }

}
async setrecentslisten(song){
let index=this.user.recents.indexOf(song.id)
  if(index==-1){
    this.user.recents.push(song.id)
  }
  else{
    let ind=this.recents.indexOf(song)
    this.recents.splice(ind+1,1)
   
  }
  this.recents.unshift(song)
  await this.natStore.setItem("store",{user:this.user}).then(()=>{console.log("it's done")})
  .catch((error)=>{console.log(error)})
 
}
  async listenafter(song){
  
    let ind=this.attente.indexOf(song)
    
    let index=this.attente.indexOf(this.song)

   this.attente.splice(index+1,0,song)
    
   if(ind!=-1)
  this.attente.splice(ind+1,1)
      
  
}
async forwardsong(song:Song,songs:Array<any>){
 
 await this.stop();
 //this.initisong=true;
 let i=songs.findIndex(song=>song.id==this.song.id)
 
if(i===songs.length-1){
this.song=await songs[0]
 
}
else{
 
  this.song=await songs[i+1]
}

await this.getDuration(this.song)
this.play(this.song);
}
async backwardsong(song:Song,songs:Array<any>){
 await this.stop()
 let i=songs.findIndex(song=>song.id==this.song.id)
if(i===0){
this.song=await songs[songs.length-1]

}
else{
  this.song=await songs[i-1]
    }
   await this.getDuration(this.song)

    this.play(this.song);
   
}




async alertlimitnpremium(){
  const alert = await this.alertController.create({
    header: this.user.prenom+' !',
    subHeader:'Vous avez atteint votre limite quotidienne de 15 sons',
    message: 'Passez en mode premium et devenez inarrêtable!',
    buttons: [
       {
        text: 'Ok',
        handler: () => {
          console.log('Confirm Okay');
         
        }
      }
    ]
  });

  await alert.present();

}
controlMusics(song){
  let img="";
  if(this.offline){
     img=song.img
  }else{
   img=song.imgurl
  }
  
this.musicControls.create({
  track       : song.titre,        // optional, default : ''
  artist      : song.artiste,                       // optional, default : ''
  cover       : img,      // optional, default : nothing
  // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
  //           or a remote url ('http://...', 'https://...', 'ftp://...')
  isPlaying   : false,                         // optional, default : true
  dismissable : true,                         // optional, default : false

  // hide previous/next/close buttons:
  hasPrev   : true,      // show previous button, optional, default: true
  hasNext   : true,      // show next button, optional, default: true
  hasClose  : true,       // show close button, optional, default: false
// hasScrubbing:true,

  // Android only, optional
  // text displayed in the status bar when the notification (and the ticker) are updated, optional
 // ticker    : 'En cours: '+ song.titre +' de '+ song.artiste,
  // All icons default to their built-in android equivalents
  playIcon: 'media_play',
  pauseIcon: 'media_pause',
  prevIcon: 'media_prev',
  nextIcon: 'media_next',
  closeIcon: 'media_close',
  notificationIcon: 'notification'
 }).then(async (
   
 )=>{
    // activates the observable above
 await this.musicControls.listen();

 }).catch((error)=>{
 console.log(error)
 });

 this.musicControls.subscribe().subscribe(action => {

   
     const message = JSON.parse(action).message;
         switch(message) {
             case 'music-controls-next':
              
                this.forwardsong(this.song,this.attente)
               
                
                 break;
             case 'music-controls-previous':
             
                this.backwardsong(this.song,this.attente)
               
                
                 break;
             case 'music-controls-pause':
              
                 this.pause(this.song)
                
                 break;
             case 'music-controls-play':
             
                 this.play(this.song)
                
                 break;
             case 'music-controls-destroy':
                 this.stop()
                 if(this.isbackground){
                   this.backgroundMode.disable()
                 }
                 break;

         // External controls (iOS only)
         case 'music-controls-toggle-play-pause' :
                 // Do something
                 break;
         case 'music-controls-seek-to':
           // Do something
           break;
         case 'music-controls-skip-forward':
           // Do something
           break;
         case 'music-controls-skip-backward':
           // Do something
           break;

             // Headset events (Android only)
             // All media button events are listed below
             case 'music-controls-media-button' :
                 // Do something
                 break;
             case 'music-controls-headset-unplugged':
                 // Do something
                 break;
             case 'music-controls-headset-plugged':
                 // Do something
                 break;
             default:
                 break;
         
     }
    });

  }
  
  ///////////////////////////////////////Publicités//////////////////////////

  launchInterstitial() {

    let interstitialConfig: AdMobFreeInterstitialConfig = {
        isTesting:true, // Remove in production
        autoShow:false,
        id:'ca-app-pub-9832793759423844/9920827403'
    }; 

    this.admob.interstitial.config(interstitialConfig);

    this.admob.interstitial.prepare().then(() => {
        // success 
        console.log("started!")
       
    }).catch((error)=>{
      console.log(error)
    });

}
showInterstitial() {
  //CHECK AND SHOW INTERSTITIAL
  this.admob.interstitial.isReady().then(() => {
  //AT .ISREADY SHOW 
  this.admob.interstitial.show().then(() => {
  console.log('INTERSTITIAL LOADED')
  })
  .catch(e => console.log('PROBLEM LOADING REWARD VIDEO: ', e)  );
  })
  .catch(e => console.log('PROBLEM LOADING REWARD VIDEO: ', e)  );
  }


}
