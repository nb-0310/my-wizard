import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Erc721Component } from './components/erc721/erc721.component';
import { MainComponent } from './components/main/main.component';
import { Erc1155Component } from './components/erc1155/erc1155.component';
import { Erc20Component } from './components/erc20/erc20.component';
import { GovernorComponent } from './components/governor/governor.component';
import { SignComponent } from './components/sign/sign.component';
import { UseContractComponent } from './components/use-contract/use-contract.component';
import { IcoComponent } from './components/ico/ico.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { IcoPromptComponent } from './components/ico-prompt/ico-prompt.component';

const routes: Routes = [
  { path: '', component: SignComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthService] },
  { path: 'main', component: MainComponent, canActivate: [AuthService] },
  { path: 'ico-prompt', component: IcoPromptComponent, canActivate: [AuthService] },
  { path: 'erc721', component: Erc721Component, canActivate: [AuthService] },
  { path: 'erc1155', component: Erc1155Component, canActivate: [AuthService] },
  { path: 'erc20', component: Erc20Component, canActivate: [AuthService] },
  {
    path: 'governor',
    component: GovernorComponent,
    canActivate: [AuthService],
  },
  {
    path: 'use-contract',
    component: UseContractComponent,
    canActivate: [AuthService],
  },
  {
    path: 'ico',
    component: IcoComponent,
    canActivate: [AuthService],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
