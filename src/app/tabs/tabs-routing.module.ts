import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path: 'acceuil',
        loadChildren: () => import('../acceuil/acceuil.module').then( m => m.AcceuilPageModule)
      },
      {
        path: 'biblio',
        loadChildren: () => import('../biblio/biblio.module').then( m => m.BiblioPageModule)
      },
      {
        path: 'gossip',
        loadChildren: () => import('../gossip/gossip.module').then( m => m.GossipPageModule)
      },
      {
        path: 'profiltab',
        loadChildren: () =>  import('../profiltab/profiltab.module').then( m => m.ProfiltabPageModule)
        
  },
 
{
  path:'',
  redirectTo:'/tabs/acceuil',
  pathMatch:'full'
}
    ]
  },
  {
    path:'',
    redirectTo:'/tabs/acceuil',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
