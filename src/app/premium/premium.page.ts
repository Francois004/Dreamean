import { Component, OnInit } from '@angular/core';
import {NavController,ModalController,PopoverController, LoadingController, AlertController, ToastController} from '@ionic/angular';
import { CheckoutOptions } from 'fedapay-angular';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {AuthService} from '../auth.service';







@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
})
export class PremiumPage implements OnInit {
 // public isAvailable: BehaviorSubject<boolean> = new BehaviorSubject(false);
 public ispremium:boolean=false;
 //setprem=this.setpremium.bind(this)
 public delayId:any;
 // global Object container; don't use var
 public user:any;

  constructor(public modalCtrl:ModalController,public platform:Platform,private nativeStore:NativeStorage,public auth:AuthService) { 
   this.backButtonEvent();
  /* this.nativeStore.getItem('store').then((store)=>{
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
        amount: 1500,
        description: 'Dreamean premium'
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
        text: "Vite j'en profite"
    },
    onComplete(resp) {
  
   
    // const FedaPay = window['FedaPay'];
       // if (resp.reason === FedaPay.DIALOG_DISMISSED) {
         //   alert('Vous avez fermé la boite de dialogue');
      //  } else {
//alert('Transaction terminée: ' + resp.reason);
            console.log("resp.reason",resp.transaction);

           if(resp.transaction.status==='approved'){
        //    var x = new PremiumPage( this.modalCtrl);
            // x.setpremium();
         //  x.modalCtrl.dismiss(resp.transaction,undefined);
         (<any> window).ispremium=true;
        // console.log( (<any> window)); 
        
      //  }
        }
  
       
      }
  };
  setpremium() {
    this.ispremium=true
   
 }
 backButtonEvent() {
  this.platform.backButton.subscribe(async () => {
      // close action sheet
      try {
          console.log("Android hardware back button detected!")
         this.dismiss()
      } catch (error) {
      }
    })
  }
  
    
  
  
  dismiss() {
   
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss( (<any> window).ispremium,undefined);
    
  }
  
  
}
