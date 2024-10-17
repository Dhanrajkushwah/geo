import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationSearchComponent } from './location-search/location-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';



const routes: Routes = [
  { path: 'location', component: LocationSearchComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
