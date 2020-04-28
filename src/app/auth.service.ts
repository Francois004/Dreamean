import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
//import { AngularFireDatabase } from 'angularfire2/database';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController,AlertController,NavController,ToastController } from '@ionic/angular';
import { User } from '../app/interfaces/user';
import { Article } from '../app/interfaces/article';
import { Song,Album} from '../app/interfaces/song';
import { map } from 'rxjs/operators';
//import 'rxjs/add/operator/toPromise';
import {catchError, retry} from 'rxjs/operators'
import {MusicserverService } from './musicserver.service';

@Injectable()
export class AuthService {
 
 
 user:User={
  id:"",
prenom:"",
nom:"",
mail:"",
imgurl:"",
num:"",
favoritesarticles:[],
listenssong:[],
favoritessong:[],
sawnarticles:[],
downloadeds:[],
fordownloads:[],
payeds:[],
ispremium:false,
isadmin:false,
recents:[],
playlists:[],
timestop:0,
createdAt:0,
endAt:0,
enddate:"",
createddate:""
};
prixtot:number=0;
cart:Array<any>=[];
badDownloads:Array<any>=[];
downloads:Array<any>=[];
lastListens:Array<any>=[];
favorites:Array<any>=[];
islostsong:boolean=false;
  pseudo:string;
  phoneNumber:any;
  phoned:boolean=false;
  premiumoperation:boolean=false
  public enddate:any;
  public users:Array<any>;
  public usersCollection:AngularFirestoreCollection<User>;
  public articlesCollection:AngularFirestoreCollection<Article>;
  public songCollection:AngularFirestoreCollection<Song>;
 // nativeStorage: any;
  constructor(public alertCtrl:AlertController,public loadingCtrl:LoadingController,public toast:ToastController,
    public nav:NavController,public musicserver:MusicserverService,public db:AngularFirestore,public natStorage:NativeStorage
    /*public afauth:AngularFireAuth*/){
     this.usersCollection = this.db.collection<User>('users');
      this.articlesCollection=db.collection<Article>('articles');
    //  this.songCollection=db.collection<Song>('singles');
     this.db
    .collection<User>('users')
    .snapshotChanges().pipe(map(users=> {
      return users.map(user=> {
        const data = user.payload.doc.data();
        const id = user.payload.doc.id;
        return { id, ...data };
      });
  })).subscribe((value)=>{
    this.users=value
  });
    
    }
    
  ////////////////////////////////user credentials functions ////////////
  async loadUser(num:string){
    var that=this
    const pnum=""+ num;
    console.log("pnm",pnum)
    that.user=await that.users.find(cuser=>cuser.num===pnum)
   // that.musicserver.user=that.user;
    //console.log("nuser",that.user)
    if(that.user){
      console.log("user exist:",this.user)
      that.nav.navigateRoot('/tabs/acceuil')
      await that.natStorage.setItem("store",{user:this.user}).then(async()=>{
        //  await   loading.dismiss()
           that.nav.navigateRoot('/tabs/acceuil')
           }).catch(async function(error){
             that.nav.navigateRoot('/tabs/acceuil')
             console.log("Error with storing!")
            
           })
      }
      else{
        let user={
          id:"",
    prenom: "",
    nom:"",
    mail:"",
    imgurl:"",
    num:pnum,
    favoritesarticles:[],
    listenssong:[],
    favoritessong:[],
    sawnarticles:[],
    fordownloads:[],
    downloadeds:[],
    payeds:[],
    recents:[],
    playlists:[],
    timestop:0,
    ispremium:false,
    isadmin:false,
    createdAt:0,
    endAt:0,
    enddate:"",
    createddate:""
        }
       
        console.log("user not exist")
        that.usersCollection.add(user).then((ref)=>{
          user.id=ref.id
          that.usersCollection.doc(ref.id).update({
            id:ref.id
          }).then(async (res)=>{
            console.log("res",res)
            that.user=user
            console.log("user created!",that.user)
           // that.musicserver.user=that.user;
            
            await that.natStorage.setItem("store",{user:this.user}).then(async()=>{
            //  await   loading.dismiss()
               that.nav.navigateRoot('/tabs/acceuil')
               }).catch(async function(error){
                 that.nav.navigateRoot('/tabs/acceuil')
                 console.log("Error with storing!")
                
               })
          }).catch((error)=>{console.log("error with creating user",error)})
        })
      }
  }

  async updateusercredt(user:User){
    // console.log("init",user.pseudo)
     let loading = await this.loadingCtrl.create({
       spinner: "crescent",
       message: '',
       translucent: true,
     })
     await loading.present()
     this.usersCollection.doc(user.id).update({
       prenom: user.prenom,
       nom:user.nom,
       mail:user.mail
     }).then(()=>{
       console.log("nom:",user.nom)
       loading.dismiss()
     }).catch((error)=>{
       console.log(error)
       loading.dismiss()
     })
   }
  ///////////////////////////////////article functions

  likearticle(article:Article){

    this.articlesCollection.doc(article.id).update({
      likes:article.likes+1
    }).then(()=>{
     // console.log("isliked")
    })

  }
  unlikearticle(article:Article){

    this.articlesCollection.doc(article.id).update({
      likes:article.likes-1
    }).then(()=>{
     // console.log("unliked")
    })

  }
  viewarticle(article:Article){
    this.articlesCollection.doc(article.id).update({
      sees:article.sees+1
    }).then(()=>{
      console.log("isview")
    }).catch(error=>console.log("error update",error))
  }

  userlikearticle(user:User,article:Article){
   
   let index=user.favoritesarticles.indexOf(article.id)
   if(index===-1){
     article.liked=true
     user.favoritesarticles.push(article.id)
    this.likearticle(article)
   }
   else{
    user.favoritesarticles.splice(index, 1);
    this.unlikearticle(article)
    article.liked=false
   }
   this.updateuserarticles(user,article)
  }
  async userviewarticle(user:User,article:Article){
   // var that=this
    this.musicserver.getdetailsforarticle(article.id)
    let index=user.sawnarticles.indexOf(article.id)
    if(index===-1){
      user.sawnarticles.push(article.id)
      console.log("user sawn",user.sawnarticles)
      this.updateuserviewarticle(user)
       this.viewarticle(article)
    }
    let indexx=user.favoritesarticles.indexOf(article.id)
    if(indexx!==-1){
      article.liked=true
    }
  }
  updateuserviewarticle(user:User){
    var that=this
    that.usersCollection.doc(user.id).update({
      sawnarticles:user.sawnarticles
    }).then(()=>{
      console.log("sawns articles:",user.sawnarticles)
     
    })
   
  }




  ///song functions
 
  repeatsong(song:Song){
    song.isrepeat=!song.isrepeat;
  }
  loopsong(song:Song){
    song.islooped=!song.islooped;
  }
/////////////////////////////////////favorites songs///////////////////////
  
 /* likeornotsong(song:Song){

    this.musicserver.songsCollection.doc(song.id).update({
      likes:song.likes
    }).then(()=>{
      console.log("unliked")
    })

  }
 */
  
  async userlikesong(user:User,song:Song){
   
   let index=user.favoritessong.indexOf(song.id)
   let ind=this.favorites.indexOf(song)
   if(index===-1){
     user.favoritessong.push(song.id)
     song.likes++;
     this.favorites.push(song)
   }
   else{
    user.favoritessong.splice(index,1)
    song.likes--;
    this.favorites.splice(ind,1);
   }
   song.isliked=!song.isliked
 // await  this.likeornotsong(song)
  await this.usersavefavoritesongs(user)
  }
  userviewfavorites(user:User){
 
    for (let id of user.favoritessong){

    let song=  this.musicserver.getSong(this.musicserver.singles,id)
   
   if(song) {
     song.isliked=true;
     this.favorites.push(song)
    
   }
   
    }
  }
  usersavefavoritesongs(user:User){
    
    this.usersCollection.doc(user.id).update({
      favoritessong:user.favoritessong
    }).then(async ()=>{
      //console.log("favorites songs:",user.favoritessong)
      await    this.natStorage.setItem('store',{user:this.user}).then((value)=>{
        console.log('update liking')
      })
    })
  }


  
  //////////////////////listen songs functions///////////////////////

   listensong(song:Song){
  
    this.songCollection.doc(song.id).update({
      listens:song.listens+1
    }).then(()=>{
      console.log("islisten")
    })
  }
  
  
  updateuserlistensong(user:User){
    this.usersCollection.doc(user.id).update({
      listenssong:user.listenssong
    }).then(()=>{
      console.log("listen s:",user.listenssong)
    })
  }

  userviewlistens(){
    for(let id of this.user.recents){
      let song=  this.musicserver.getSong(this.musicserver.singles,id)
     if(song){
       this.musicserver.recents.push(song)
     }
    }
    
  }


  /////////////////////////////nons premium limitation///////////////////
  verifylimitlistensfavoritepage(id){
 /*   let index=this.user.fordownloads.indexOf(id)
    if((index==-1)&&!this.musicserver.offline&&!this.user.ispremium){
        
        this.limitlistens();
    }*/
  //  this.musicserver.user=this.user
      this.musicserver.getdetailsforsongfromfavoritepage(id)
    
  }
  verifylimitlistensacceuilpage(id){
   
    let index=this.musicserver.directories.findIndex(song=>song.id==id)
    if(index!=-1){
      this.musicserver.getsongfromoffline(this.musicserver.directories[index])
    }else{
     // this.musicserver.user=this.user
      this.musicserver.getdetailsforsong(id)
      
    }
    
  /*  if((index==-1)&&!this.musicserver.offline&&!this.user.ispremium){
        
        this.limitlistens();
    }
    */
    
    
  }
  verifylimitlistensalbumsong(indx,idalbum){
    /*let index=this.user.fordownloads.indexOf(idalbum)
    if(index!=-1){

    }
   if((index==-1)&&!this.musicserver.offline&&!this.user.ispremium){
        
        this.limitlistens();
    }*/
   
      //this.musicserver.user=this.user
      this.musicserver.getsongfromalbum(indx,idalbum)
      
    

    
  //  this.musicserver.user=this.user
     // this.musicserver.getsongfromalbum(indx,idalbum);
    
  }
 async limitlistens(){
  // alert('m enter')
  let timer=new Date().getTime();
  this.user.listenssong=this.musicserver.user.listenssong
   if((timer-this.user.timestop>=(24*60*60*1000))&&(this.user.timestop!==0)&&this.user.listenssong.length>=15){
    this.user.listenssong=[];
        this.user.timestop=0;
   }
   else if(this.user.listenssong.length>=10&&this.user.listenssong.length<15){
    this.limitnpremiumToast();
   }
   else if(this.musicserver.user.listenssong.length>=15&&(this.musicserver.user.timestop==0)){
    this.user.timestop=new Date().getTime();
   }
   if(this.user.listenssong.length<17)
   this.usersCollection.doc(this.user.id).update({
    timestop:this.user.timestop,
   listenssong:this.musicserver.user.listenssong
 }).then(async ()=>{
   await    this.natStorage.setItem('store',{user:this.user}).then((value)=>{
     console.log("ok!")
   })
    
    
  })
  
 }
 async limitnpremiumToast() {
  const toast = await this.toast.create({
    message:'Plus que '+(15-this.user.listenssong.length)+' titres disponibles',
    duration: 3000
  });
  toast.present();

}


 async alertlimitnpremium(){
  const alert = await this.alertCtrl.create({
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
 /////////////////////////download songs functions/////////////////////////////////////
  usersavedownload(user:User){

     this.usersCollection.doc(user.id).update({
        fordownloads:user.fordownloads,
        downloadeds:user.downloadeds,
        payeds:user.payeds
      }).then(async ()=>{
    await    this.natStorage.setItem('store',{user:this.user}).then((value)=>{})
       // console.log("downloaded songs:",user.downloadedsongs)
      })
    }
   
userviewdownloads(user:User){
 
  for (let id of user.fordownloads){
 
  let song=  this.musicserver.getSong(this.musicserver.singles,id)
  let album=this.musicserver.getAlbum(this.musicserver.albumss,id)
 
 if(song) {
   song.downloaded=true;
   let index=this.user.payeds.indexOf(song.id)
   if(index!=-1){
     song.isvalidate=true
   }
  
 }
 if(album) {
   
   let index=user.payeds.indexOf(album.id)
   for(let id of album.ids){
   
    let song=  this.musicserver.getSong(this.musicserver.singles,id)
    if(song){
      song.downloaded=true;
      if(index!=-1){
       song.isvalidate=true
      }
    }
   
   }
   album.downloaded=true;
   if(index!=-1){
     album.isvalidate=true
   }
  
 }

  }
  
}

retrieveDownloads(){
  let tabs=[];
  this.downloads=[];
  tabs=this.user.payeds
  if(this.user.ispremium){
 for(let  idx of this.user.downloadeds){
   tabs.push(idx)
 }
  }
  
  for(let id  of tabs){
    let song=this.musicserver.directories.find(song=>song.id==id)
    if(song){
      
      }
      else{
        let single=this.musicserver.getSong(this.musicserver.singles,id)
        if(single){
          this.downloads.push(single)
        }
        else{
          let album=this.musicserver.getAlbum(this.musicserver.albumss,id)
          if(album){
            this.downloads.push(album)
          }
        }
      }
    }
  
}
/////////////////////////////////////////Cart funtions/////////////////

  userstartdownload(user:User,song){
    
    let index=this.cart.indexOf(song)
    if(index===-1){

    this.pushtocart(user,this.cart,song.id)
  }
  else{
    this.alreadycartToast(song)
  }
  }
  releasecart(user:User){
    user.fordownloads=[]
    this.cart=[]
    this.prixtot=0;
  }
  deletefromcart(){

  }
  async pushtocart(user:User,tab:Array<any>,id:string){
      let album=await this.musicserver.albumss.find(album=>album.id===id)
      let  song=await this.musicserver.singles.find(song=>song.id===id)
      if(song){
     tab.push(song)
     this.prixtot+=song.prix;
     this.presentcartToast(song)
      }
     if(album){
     tab.push(album)
    this.prixtot+=album.prix;
    this.presentcartToast(album)
     }
     
  }


 
  
  ///articles functions

  updateuserarticles(user:User,article:Article){
    this.usersCollection.doc(user.id).update({
      favoritesarticles:user.favoritesarticles
    }).then(()=>{
      console.log("favorites articles:",user.favoritesarticles)
    })
  }
  updateallarticles(user:User,articles:Array<any>){
    for (let article of articles){
      let index=user.favoritesarticles.indexOf(article.id)
      if(index!==-1){
        article.liked=true
      }
      else{
        article.liked=false
      }
    }
  }
  updateallsongs(user:User,songs:Array<any>){
    for (let song of songs){
      let index=user.favoritesarticles.indexOf(song.id)
      if(index!==-1){
        song.isliked=true
      }
      else{
        song.isliked=false
      }
    }
  }
  ///search functions////////////////////////////////////////////////////////////////
 /* setrecentsearch(searchterm:string,user:User){
    if(user.searchs.length>=7){
      user.searchs.pop()
    }
    
    let index=user.searchs.indexOf(searchterm)
    if(index===-1){
      user.searchs.unshift(searchterm)
     // console.log("user sawn",user.sawnarticles)
     this.usersCollection.doc(user.id).update({
      searchs:user.searchs
    }).then(()=>{
      console.log("recents searchs",user.searchs)
    })
      
    }
    
  }*/
  
  async presentcartToast(song) {
    const toast = await this.toast.create({
      message: song.titre +' de '+ song.artiste + ' ajouté au panier .',
      duration: 2000
    });
    toast.present();

  }
  async alreadycartToast(song) {
    const toast = await this.toast.create({
      message: song.titre +' de '+song.artiste   + ' déja présent dans le panier.',
      duration: 2000
    });
    toast.present();

  }
//premium section


async setpremiumstatus(user:User){
 this.usersCollection.doc(user.id).update({
    ispremium: user.ispremium ,
    
  }).then(async ()=>{
    console.log("ispremium?",user.ispremium)
   
  }).catch((error)=>{
    console.log(error)
    //loading.dismiss()
  })

}
  async presentToast() {
    const toast = await this.toast.create({
      message: 'Mode premium désactivé!',
      duration: 4000
    });
    toast.present();

  }
  async verifypremium(user:User){
    let date=new Date().getTime();
    
    if(+date <= user.endAt){
      console.log("not yet")
    }
    else{
      console.log("Votre abonnement est expiré")
     
     await this.destroypremium(user)
     this.alertOnendpremium()
      this.natStorage.setItem('store',{user:this.user}).then((value)=>{}).catch((error)=>{
        console.log("error")
      })
    }
  }
  destroypremium(user:User){
    this.usersCollection.doc(user.id).update({
      createdAt: -1,
      endAt:-1,
      createddate:"",
      enddate:"",
      fordownloads:[],
      ispremium:false
    }).then(async ()=>{
     
    }).catch(error=>{
      console.log(error)
    })

  }
  async startpremium(user:User){
    user.createdAt=await new Date().getTime()
    user.endAt=user.createdAt + 2628000000;
    user.ispremium=true;
    user.createddate=await this.formatdate(user.createdAt),
    user.enddate=await this.formatdate(user.endAt)
    this.usersCollection.doc(user.id).update({
      createdAt: user.createdAt,
      endAt:user.endAt,
      createddate:user.createddate,
      enddate:user.enddate,
      ispremium:true,
      listenssong:[]
    }).then(async ()=>{
      console.log("new premium",user.createdAt,user.endAt)
      this.alertOnstartpremium(user)
     await this.natStorage.setItem("store",{user:user}).then(()=>{
       // alert(user.enddate)
      }).catch(error=>console.log(error))
    }).catch(error=>{
      console.log(error)
    })
    }
  formatdate(enddate:number){
    var mois = new Array("janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre");
    var msg=new Date()
    msg.setTime(enddate)
    // on construit le message
    let  date:string;
    date=" ";   // nom du jour
    date += msg.getDate() + " ";   // numero du jour
    date += mois[msg.getMonth()] + " ";   // mois
    date += msg.getFullYear();
    return date;
  }
  async alertOnendpremium(){
    const alert = await this.alertCtrl.create({
      header: 'Dreamean premium',
      subHeader:'Votre abonnement est arrivé à expiration !',
      message: 'Merci de renouveler pour profiter de nos services',
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
  async alertOnstartpremium(user:User){
    const alert = await this.alertCtrl.create({
      header: 'Dreamean premium',
      subHeader:'Félicitations vous etes maintenant un membre premium!',
      message: 'Votre abonnement prendra fin le '+user.enddate,
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
  async confirmdisablepremiumalert(user:User){
    const alert = await this.alertCtrl.create({
      header: 'Dreamean premium',
      subHeader:'Voulez-vous vraiment quitter Dreamean premium?',
      message: 'Votre perdrez votre abonnement',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           // console.log('Confirm Cancel: blah');
           user.ispremium=true;
          }
        }, {
          text: 'Confirmer',
          handler: async () => {
            console.log('Confirm Okay');
            user.ispremium=false
            this.setpremiumstatus(user)
            this.premiumoperation=false;
            await this.destroypremium(user)
            await this.natStorage.setItem('store',{user:this.user}).then((value)=>{})
            this.presentToast()

            
          }
        }
      ]
    });

    await alert.present();
  }
 async presentAlertPremium(user:User) {
   
   if(this.user.ispremium){
     this.confirmdisablepremiumalert(user)
  }

  }
  async premiumToast() {
    const toast = await this.toast.create({
      message: 'Passer au panier pour valider!',
      duration: 4000
    });
    toast.present();

  }
  payforpremium(){
    this.prixtot=1500;
    this.premiumoperation=true;
    this.premiumToast()
  }

  async destroyUser(){
    var that=this;
  const alert = await this.alertCtrl.create({
    header: "Voulez-vous vous déconnecter?",
    message: "Vous devriez vous inscrire de nouveau,Continuer?",
    buttons: [
      {
        text: "non",
        cssClass: 'color:tertiary',
        role: 'cancel',
        handler: () => {
          console.log('You clicked me');
        }
      },
      {
        text: "oui",
        cssClass: 'color:primary',
        handler: async() => {
          await that.natStorage.remove('store').then(()=>{
            that.logoutUser();
          })
         
        
      }
    }
    ]
  });

  await alert.present();
}


logoutUser(){
  var that=this
firebase.auth().currentUser.delete().then(() => {
  firebase.auth().signOut().then(()=>{
    that.nav.navigateRoot('/login');
  }).catch((error)=>{
    console.log(error);
  })
})
}

}