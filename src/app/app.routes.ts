import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ProductesComponent } from './productes/productes.component';
import { AutenticacioComponent } from './autenticacio/autenticacio.component';
import { MenuIniciComponent } from './menu-inici/menu-inici.component';

export const routes: Routes = [

    {
        path:'Menu',
        title:'Menu',
        component:MenuIniciComponent,
        children: [
          {
            path: 'productes',
            title: 'productes',
            component: ProductesComponent
          }
        ,
{
            path: 'categories',
            title: 'categories',
            component: CategoriesComponent
}
        ]

    },
    {
      path:'autenticacio',
      title:'autenticacio',
      component:AutenticacioComponent,
  },

];
