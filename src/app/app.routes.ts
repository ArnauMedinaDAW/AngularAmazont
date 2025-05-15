import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ProductesComponent } from './productes/productes.component';
import { AutenticacioComponent } from './autenticacio/autenticacio.component';
import { MenuIniciComponent } from './menu-inici/menu-inici.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ProcesPagamentComponent } from './proces-pagament/proces-pagament.component';
import { PerfilUsuariComponent } from './perfil-usuari/perfil-usuari.component';
import { AdminProductesComponent } from './admin-productes/admin-productes.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'autenticacio',
    pathMatch: 'full'
  },
  {
    path: 'autenticacio',
    title: 'Autenticacio',
    component: AutenticacioComponent
  },
  {
    path: 'perfil',
    component: PerfilUsuariComponent
  },
  {
    path: 'admin-productes',
    component: AdminProductesComponent
  },
  {
    path: 'menu',
    component: MenuIniciComponent,
    children: [
      {
        path: '',
        redirectTo: 'productes',
        pathMatch: 'full'
      },
      {
        path: 'productes',
        component: ProductesComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'carrito',
        component: CarritoComponent,
        children: [
          {
            path: 'pagament',
            component: ProcesPagamentComponent
          }
        ]
      }
    ]
  }
];
