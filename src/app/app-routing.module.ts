import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
 /* { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'acceuil',
    loadChildren: () => import('./acceuil/acceuil.module').then( m => m.AcceuilPageModule)
  },
  {
    path: 'biblio',
    loadChildren: () => import('./biblio/biblio.module').then( m => m.BiblioPageModule)
  },
  {
    path: 'gossip',
    loadChildren: () => import('./gossip/gossip.module').then( m => m.GossipPageModule)
  },*/
  
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },

 /* {
    path: 'premium',
    loadChildren: () => import('./premium/premium.module').then( m => m.PremiumPageModule)
  },
  */
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'albdetails',
    loadChildren: () => import('./albdetails/albdetails.module').then( m => m.AlbdetailsPageModule)
  },
  {
    path: 'songdetails',
    loadChildren: () => import('./songdetails/songdetails.module').then( m => m.SongdetailsPageModule)
  },
  {
    path: 'modalalb',
    loadChildren: () => import('./modalalb/modalalb.module').then( m => m.ModalalbPageModule)
  },
  {
    path: 'article',
    loadChildren: () => import('./article/article.module').then( m => m.ArticlePageModule)
  },
  {
    path: 'cgu',
    loadChildren: () => import('./cgu/cgu.module').then( m => m.CguPageModule)
  },
  {
    path: 'filedattente',
    loadChildren: () => import('./filedattente/filedattente.module').then( m => m.FiledattentePageModule)
  },
  {
    path: 'listenpopov',
    loadChildren: () => import('./listenpopov/listenpopov.module').then( m => m.ListenpopovPageModule)
  },
  {
    path: 'panier',
    loadChildren: () => import('./panier/panier.module').then( m => m.PanierPageModule)
  },
  /*{
    path: 'profiltab',
    loadChildren: () => import('./profiltab/profiltab.module').then( m => m.ProfiltabPageModule)
  },
 {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  }*/

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
