import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { Erc721Component } from './components/erc721/erc721.component';
import { Erc1155Component } from './components/erc1155/erc1155.component';
import { Erc20Component } from './components/erc20/erc20.component';
import { GovernorComponent } from './components/governor/governor.component';
import { SignComponent } from './components/sign/sign.component';
import { UseContractComponent } from './components/use-contract/use-contract.component';
import { LoaderComponent } from './components/loader/loader.component';
import { IcoComponent } from './components/ico/ico.component';
import { ItemNavComponent } from './components/item-nav/item-nav.component';
import { HomeComponent } from './components/home/home.component';
import { IcoPromptComponent } from './components/ico-prompt/ico-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    Erc721Component,
    Erc1155Component,
    Erc20Component,
    GovernorComponent,
    SignComponent,
    UseContractComponent,
    LoaderComponent,
    IcoComponent,
    ItemNavComponent,
    HomeComponent,
    IcoPromptComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
