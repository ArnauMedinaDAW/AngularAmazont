import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ProductesComponent } from './productes/productes.component';

export const routes: Routes = [

    {
        path:'productes',
        title:'productes',
        component:ProductesComponent,
    },
    {
        path:'categories',
        title:'categories',
        component:CategoriesComponent,
        children: [
            {
              path: 'productes',
              title: 'productes',
              component: ProductesComponent
            }
          ]
    }
];
