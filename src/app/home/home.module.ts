
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { AppMigrationComponent } from "../dmap-extension/app-migration/app-migration.component";
import { DbConfigComponent } from "../db-config/db-config.component";
import { DbListComponent } from "../db-list/db-list.component";
import { DbMigrationDetailComponent } from "../db-migration-detail/db-migration-detail.component";
import { AppDashboardComponent } from "../dmap-extension/app-dashboard/app-dashboard.component";
// import { MasterWorkerNodeComponent } from "../master/master-worker-node/master-worker-node.component";
// import { MasterAnalyticsDashboardComponent } from "../master/master-analytics-dashboard/master-analytics-dashboard.component";
// import { MasterAppDbDetailsComponent } from "../master/master-app-db-details/master-app-db-details.component";
import { StartAssessmentModalComponent } from "../dmap-extension/Modal/start-assessment-modal/start-assessment-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../common/shared.module";
import { DbCreateNewPgInstanceComponent } from "../db-create-new-pg-instance/db-create-new-pg-instance.component";

@NgModule({
  imports: [HomeRoutingModule, ReactiveFormsModule, FormsModule, SharedModule],
  declarations: [
    //HomeComponent,
    //AppMigrationComponent,
    // DbConfigComponent,
    // AppDashboardComponent,
    // DbListComponent,
    // DbConfigComponent,
    // DbMigrationDetailComponent,
    // MasterWorkerNodeComponent,
    // MasterAnalyticsDashboardComponent,
    // MasterAppDbDetailsComponent,
    // StartAssessmentModalComponent,
    // DbCreateNewPgInstanceComponent
  ]
})
export class HomeModule { }