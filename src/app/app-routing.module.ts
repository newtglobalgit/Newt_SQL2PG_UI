import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DbSetupComponent } from './db-setup/db-setup.component';
import { DbAssessmentComponent } from './db-assessment/db-assessment.component';
import { ChatGptIntegrationComponent } from './chat-gpt-integration/chat-gpt-integration.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  { path: 'resetPassword', component: LoginComponent },
  { path: 'gen-ai', component: ChatGptIntegrationComponent },
  { path: 'dbSetup', component: DbSetupComponent },
  { path: 'dbAssessment', component: DbAssessmentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
