import { Component, OnInit } from '@angular/core';
import { CheckoutOptions } from 'fedapay-angular';
import {AuthService} from '../auth.service';
import {NavController,ModalController,PopoverController, LoadingController, AlertController, ToastController} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.page.html',
  styleUrls: ['./panier.page.scss'],
})
export class PanierPage implements OnInit {
  public ispayed:boolean=false;
  public user:any;
  constructor(public modalCtrl:ModalController,public auth:AuthService,public platform:Platform,private nativeStore:NativeStorage) {
    this.backButtonEvent()
  /*  this.nativeStore.getItem('store').then((store)=>{
      if((store!=null)&&(store.user!=undefined)){
      this.user=store.user;
      }
  
    }).catch((error)=>{
      console.log(error);
     // alert(error)
    
    })*/
   }

  ngOnInit() {
  }
  checkoutButtonOptions: CheckoutOptions = {
 
    transaction: {
        amount: this.auth.prixtot,
        description: 'Dreamean paiement de sons'
    },
    currency: {
        iso: 'XOF'
    },
    customer: {
      email: this.auth.user.mail,
      lastname: this.auth.user.nom,
      firstname: this.auth.user.prenom,
      phone_number:{
        number:this.auth.user.num,
        country:"BJ"
      }
    },
    button: {
        class: 'btn btn-primary',
        text: "Valider le panier"
    },
    onComplete(resp) {
  
   
  
            console.log("resp.reason",resp.transaction);

           if(resp.transaction.status==='approved'){
     
         (<any> window).ispayed=true;
         console.log( (<any> window));
      
        }
  
       
      }
  };
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
        // close action sheet
        try {
           //console.log("Android hardware back button detected!")
           this.dismiss()
        } catch (error) {
        }
      })
    }

  delete(song){
    this.auth.prixtot-=song.prix;
    let pos=this.auth.cart.indexOf(song)
    this.auth.cart.splice(pos,1)
   
  }

  dismiss() {
   
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss( (<any> window).ispayed,undefined);
    
  }
  

}
