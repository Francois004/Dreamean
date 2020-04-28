import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ToastController,LoadingController, AlertController,MenuController} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  
    
    errorMessage: string = '';
    successMessage: string = '';
   phoneNumber:any;
   loading:any;
   selectedcountry:any={
    code:"229",
    name:"Benin",
    placeholder:"Ex: 9716****"
   };
   customPopoverOptions: any = {
    header: '',
    subHeader: '',
    message: ''
  };
  
    public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
    countries=[
      {
        code:"229",
        name:"Benin",
        placeholder:"Ex: 6616XXXX"

      },
      {
        code:"228",
        name:"Togo",
        placeholder:"Ex: 9716XXXX"

      },
      {
        code:"212",
        name:"Maroc",
        placeholder:"Ex: 605XXXXXX"

      },
    ]
 
    constructor(
      public toastCtrl:ToastController,
      private nav: NavController,
      private loadingController: LoadingController,
    private alertController:AlertController,
      public authService: AuthService,
      private nativeStorage: NativeStorage,
      private formBuilder: FormBuilder,
     
    ) {
    }   
    ngOnInit(){
    
      
     
    }
    ionViewDidEnter() {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',{
        'size': 'invisible',
        'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('sucess recaptcha')
        },'expired-callback': function() {
          // Reset reCAPTCHA?
          console.log("expired-callback")
        }
        });
     
    }
    
   
     showToastSucces(titre) {
      let toast = this.toastCtrl.create({
        message:titre,
        duration: 4000
      }).then((toastData) => {
        console.log(toastData);
        toastData.present();
      });
  }
 setvalue(){
  //this.selectedcountry=this.countries[0]
   console.log("selected country",this.selectedcountry)
 }
  
   
  async signIn(code,phoneNumber: number){
  var  appVerifier = await this.recaptchaVerifier;
  var that=this;
  let loading = await this.loadingController.create({
    spinner: "crescent",
    message: 'Patientez',
    translucent: true,
  })
  loading.present()
    const phoneNumberString = "+" +code+ phoneNumber;
   firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then(async  confirmationResult => {
        console.log("i'm enter oh")
       await loading.dismiss()
   //     that.authService.user.num=phoneNumberString
     //    SMS sent. Prompt user to type the code from the message, then sign the
     //    user in with confirmationResult.confirm(code).
       let prompt = this.alertController.create({
        header: 'Entrer le code de confirmation reçu',
        inputs: [{ name: 'confirmationCode',  type:'number',placeholder: 'Confirmation Code' }],
        backdropDismiss: false,
         buttons: [
          { text: 'Retour',
          cssClass:'alertCSS',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Envoyer',
          cssClass:'alertCSS',
            handler:async data => {
              let loading = await that.loadingController.create({
                spinner: "crescent",
                message: 'Patientez',
                translucent: true,
              })
             await  loading.present()
              confirmationResult.confirm(data.confirmationCode)
              .then(async function (result) {
                // User signed in successfully.
               // console.log("Success!!you're signed",that)
                //console.log(result.user);
               that.authService.loadUser(phoneNumberString)
              

                await   loading.dismiss()
                // ...
             }).catch(async function (error) {
                // User couldn't sign in (bad verification code?)
                await   loading.dismiss()
                that.AlertConfirmcode()
                console.log("errror",error)
              });
            }
          }
        ]
      });
      await (await prompt).present();
    })
    .catch(async function (error) {
      console.error("SMS not sent", error);
     
      await   loading.dismiss()
      alert(error)
     
        });
     
    
  
  }
 
  
   
 
 
 
 
  
 

async  AlertConfirmcode(){
  const alert = await this.alertController.create({
    header: "Code de confirmation erroné",
    message:"Réessayer",
    buttons: ['OK']
  });

  await alert.present();
}

 
   
}
