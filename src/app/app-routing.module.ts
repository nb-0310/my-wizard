import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Erc721Component } from './components/erc721/erc721.component';
import { MainComponent } from './components/main/main.component';
import { Erc1155Component } from './components/erc1155/erc1155.component';
import { Erc20Component } from './components/erc20/erc20.component';
import { GovernorComponent } from './components/governor/governor.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'erc721', component: Erc721Component },
  { path: 'erc1155', component: Erc1155Component },
  { path: 'erc20', component: Erc20Component },
  { path: 'governor', component: GovernorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
