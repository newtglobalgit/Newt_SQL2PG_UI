import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DbSetupComponent } from './db-setup/db-setup.component';
import { DbAssessmentComponent } from './db-assessment/db-assessment.component';
import { GenAiIntegrationComponent } from './gen-ai-integration/gen-ai-integration.component';
import { AuthGuard } from './common/Services/authguard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  { path: 'resetPassword', component: LoginComponent },
  {
    path: 'gen-ai',
    component: GenAiIntegrationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'dbSetup', component: DbSetupComponent, canActivate: [AuthGuard] },
  {
    path: 'dbAssessment',
    component: DbAssessmentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
