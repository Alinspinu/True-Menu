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
        loadComponent: () => import('../content/category-content/category-content.page').then( m => m.CategoryContentPage),
      },
      {
        path: 'product-content/:id/:index',
        loadComponent: () => import('../content/product-content/product-content.page').then(m => m.ProductContentPage),
      },
      {
        path: 'cart',
        loadComponent: () => import('../cart/cart.page').then( m => m.CartPage)
      },
      {
        path: 'orders',
        loadComponent: () => import('../content/back-office/orders/orders.page').then( m => m.OrdersPage)
      },
      {
        path: 'cash-register',
        loadComponent: () => import('../content/back-office/cash-register/cash-register.page').then( m => m.CashRegisterPage)
      },
      {
        path: 'cash',
        loadComponent: () => import('../content/back-office/cash/cash.page').then( m => m.CashPage)
      },
      {
        path: 'finished-orders',
        loadComponent: () => import('../content/back-office/finshed-orders/finshed-orders.page').then( m => m.FinshedOrdersPage)
      },
      {
        path: 'voucher',
        loadComponent: () => import('./voucher/voucher.page').then( m => m.VoucherPage)
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
