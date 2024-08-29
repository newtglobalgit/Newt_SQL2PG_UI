import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LicenseActivationComponent } from './documentation/license/license-activation/license-activation.component';
import { MasterHomeComponent } from './master/master-home/master-home.component';
import { NodeSelectionComponent } from 'src/app/common/Modal/node-selection/node-selection.component';
import { DatabaseQuestionnaireComponent } from './master/questionnaires/database-questionnaire/database-questionnaire.component';
import { TcoQuestionnaireComponent } from './master/questionnaires/tco-questionnaire/tco-questionnaire.component';
import { DbScriptsComponent } from './master/questionnaires/db-scripts/db-scripts.component';
import { ApplicationAssessmentQuestionnaireComponent } from './master/questionnaires/application-assessment-questionnaire/application-assessment-questionnaire.component';
import { InterfaceListComponent } from './master/questionnaires/interface-list/interface-list.component';
import { MasterAnalyticsDashboardComponent } from './master/master-analytics-dashboard/master-analytics-dashboard.component';
import { DbConfigComponent } from './db-config/db-config.component';
import { DbListComponent } from './db-list/db-list.component';
import { MasterAppDbDetailsComponent } from './master/master-app-db-details/master-app-db-details.component';
import { DbDetailsComponent } from './master/questionnaires/db-details/db-details.component';
import { AuthGuard } from './common/Services/authguard.service';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  { path: 'resetPassword', component: LoginComponent },
  { path: 'service', component: DbConfigComponent },
  { path: 'license', component: LicenseActivationComponent },
  { path: 'masterService', component: MasterHomeComponent },
  { path: 'nodeSelection', component: NodeSelectionComponent },
  {
    path: 'appQuestionnaire',
    component: ApplicationAssessmentQuestionnaireComponent,
  },
  {
    path: 'interfaceQuestionnaire',
    component: InterfaceListComponent,
  },
  { path: 'dbQuestionnaire', component: DatabaseQuestionnaireComponent },
  { path: 'tcoQuestionnaire', component: TcoQuestionnaireComponent },
  { path: 'dbScripts', component: DbScriptsComponent },
  { path: 'dbDashboard', component: MasterAnalyticsDashboardComponent, canActivate: [AuthGuard]  },
  { path: 'dbSetup', component: DbConfigComponent },
  { path: 'dbRunAnalytics', component: MasterAnalyticsDashboardComponent, canActivate: [AuthGuard]  },
  { path: 'dbAppIntake', component: MasterAppDbDetailsComponent, canActivate: [AuthGuard]  },
  { path: 'dbAssessment', component: DbListComponent },
  { path: 'schemaConversion', component: DbListComponent },
  { path: 'dataMigration', component: DbListComponent },
  { path: 'databaseDetails', component: DbDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
