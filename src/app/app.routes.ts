
import { NgModule } from '@angular/core';
import { PreloadAllModules, Route, RouterModule, Routes } from '@angular/router';


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
    loadComponent: () => import('./tab-header/tab-header.page').then( m => m.TabHeaderPage)
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
  // {
  //   path: 'timer',
  //   loadComponent: () => import('./shared/timer/timer.page').then( m => m.TimerPage)
  // },
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

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
