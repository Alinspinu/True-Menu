
import { NgModule } from '@angular/core';
import { PreloadAllModules, Route, RouterModule } from '@angular/router';


export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'success',
    loadComponent: () => import('./payment/success/success.page').then( m => m.SuccessPage)
  },
  {
    path: 'failure',
    loadComponent: () => import('./payment/failure/failure.page').then( m => m.FailurePage)
  },
  {
    path: 'tab-header',
    loadComponent: () => import('./content/tab-header/tab-header.page').then( m => m.TabHeaderPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'email-sent',
    loadComponent: () => import('./auth/email-sent/email-sent.page').then( m => m.EmailSentPage)
  },
  {
    path: 'email-error',
    loadComponent: () => import('./auth/email-error/email-error.page').then( m => m.EmailErrorPage)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./auth/verify-email/verify-email.page').then( m => m.VerifyEmailPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'terms',
    loadComponent: () => import('./legal/terms/terms.page').then( m => m.TermsPage)
  },
  {
    path: 'cookie-policy',
    loadComponent: () => import('./legal/cookie-policy/cookie-policy.page').then( m => m.CookiePolicyPage)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./legal/privacy-policy/privacy-policy.page').then( m => m.PrivacyPolicyPage)
  },

  {
    path: 'coffee-content',
    loadComponent: () => import('./content/coffee-content/coffee-content.page').then( m => m.CoffeeContentPage)
  },
  {
    path: 'invite-auth',
    loadComponent: () => import('./auth/invite-auth/invite-auth.page').then( m => m.InviteAuthPage)
  },
  {
    path: 'reports',
    loadComponent: () => import('./content/back-office/reports/reports.page').then( m => m.ReportsPage)
  },
  {
    path: 'display-qr',
    loadComponent: () => import('./shared/display-qr/display-qr.page').then( m => m.DisplayQrPage)
  },
  {
    path: 'orders-view',
    loadComponent: () => import('./content/back-office/cash/orders-view/orders-view.page').then( m => m.OrdersViewPage)
  },
  {
    path: 'del-prod-view',
    loadComponent: () => import('./content/back-office/cash/del-prod-view/del-prod-view.page').then( m => m.DelProdViewPage)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
