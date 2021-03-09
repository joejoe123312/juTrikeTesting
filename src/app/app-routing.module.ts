import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'travel-cost',
    loadChildren: () => import('./travel-cost/travel-cost.module').then( m => m.TravelCostPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'driver-otw',
    loadChildren: () => import('./driver-otw/driver-otw.module').then( m => m.DriverOtwPageModule)
    ,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
    
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule),
    canActivate: [AuthGuard]
    
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'updateCurrentUser',
    loadChildren: () => import('./update-current-user-profile/update-current-user-profile.module').then( m => m.UpdateCurrentUserProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
  path: 'scan-qr',
  loadChildren: () => import('./scan-qrcode/scan-qrcode.module').then( m => m.ScanQrcodePageModule),
    canActivate: [AuthGuard]
  },
  {
  path: 'view-qr',
  loadChildren: () => import('./view-qrcode/view-qrcode.module').then( m => m.ViewQRCodePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./splash-screen/splash-screen.module').then( m => m.SplashScreenPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'testing-page',
    loadChildren: () => import('./testing-page/testing-page.module').then( m => m.TestingPagePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },
  {
    path: 'pick-up-location',
    loadChildren: () => import('./modals/pick-up-location/pick-up-location.module').then( m => m.PickUpLocationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'drop-of-location',
    loadChildren: () => import('./modals/drop-of-location/drop-of-location.module').then( m => m.DropOfLocationPageModule),
    canActivate: [AuthGuard]
  },
  

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
