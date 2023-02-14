import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BomberosMunicipalesComponent } from './components/bomberos-municipales/bomberos-municipales.component';
import { BomberosVoluntariosComponent } from './components/bomberos-voluntarios/bomberos-voluntarios.component';
import { BomberosComponent } from './components/bomberos/bomberos.component';
import { EstacionesBomberosComponent } from './components/estaciones-bomberos/estaciones-bomberos.component';
import { EstacionesPoliciaComponent } from './components/estaciones-policia/estaciones-policia.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MapaGeneralComponent } from './components/mapa-general/mapa-general.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PoliciaMunicipalComponent } from './components/policia-municipal/policia-municipal.component';
import { PoliciaNacionalComponent } from './components/policia-nacional/policia-nacional.component';
import { PoliciasComponent } from './components/policias/policias.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'estacionesPolicia', component: EstacionesPoliciaComponent, children:[
    {path: 'policiaNacional', component: PoliciaNacionalComponent},
    {path: 'policiaMunicipal', component: PoliciaMunicipalComponent},
    {path: 'policiasGeneral', component: PoliciasComponent}
  ]},
  {path: 'estacionesBomberos', component: EstacionesBomberosComponent, children:[
    {path: 'bomberosMunicipales', component: BomberosMunicipalesComponent},
    {path: 'bomberosVoluntarios', component: BomberosVoluntariosComponent},
    {path: 'bomberosGeneral', component: BomberosComponent}
  ]},
  {path: 'mapa',component: MapaGeneralComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
