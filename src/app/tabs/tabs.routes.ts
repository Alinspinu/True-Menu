import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'food',
        loadComponent: () =>
          import('./food/food.page').then((m) => m.FoodPage),
      },
      {
        path: 'coffee',
        loadComponent: () =>
          import('./coffee/coffee.page').then((m) => m.CoffeePage),
      },
      {
        path: 'bar',
        loadComponent: () =>
          import('./bar/bar.page').then((m) => m.BarPage),
      },
      {
        path: 'shop',
      loadComponent: () => import('./shop/shop.page').then((m) => m.ShopPage),
      },
      {
        path: 'category-content/:id',
        loadComponent: () => import('../category-content/category-content.page').then( m => m.CategoryContentPage),
      },
      {
        path: 'product-content/:id/:id',
        loadComponent: () => import('../product-content/product-content.page').then(m => m.ProductContentPage),
      },
      {
        path: 'cart',
        loadComponent: () => import('../cart/cart.page').then( m => m.CartPage)
      },
      {
        path: '',
        redirectTo: '/tabs/food',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/food',
    pathMatch: 'full',
  },
];
