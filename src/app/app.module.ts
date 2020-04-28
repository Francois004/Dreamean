import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { MusicserverService } from './musicserver.service';
import { AuthService } from './auth.service';
import { PaymentService } from './payment.service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
//import { AngularFireDatabaseModule } from 'angularfire2/database';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer} from '@ionic-native/file-transfer/ngx';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import * as firebase from 'firebase';
import { Media } from '@ionic-native/media/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { FedaPayCheckoutModule } from 'fedapay-angular';
import { Network } from '@ionic-native/network/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
//import { LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';
//import { PowerManagement } from '@ionic-native/power-management/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';

firebase.initializeApp(environment.firebase);
    
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,AngularFireAuthModule,
    FedaPayCheckoutModule.forRoot({ public_key: 'pk_sandbox_rug9BPfv-ZNJeAPNexkE-Z5P', app_id: 'io.ionic.starter' })],
  providers: [
    StatusBar,
    SplashScreen,
     MusicControls,
     AdMobFree,
  //  PowerManagement,
  //  AndroidPermissions,
    //Diagnostic,
    FileTransfer,
    WebView,
    File,
    Media,
  //  Base64,
   // MediaObject,
    MusicserverService,
    AuthService,
    PaymentService,
    NativeStorage,
    BackgroundMode ,
    Network,
  //  LocalNotifications,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
