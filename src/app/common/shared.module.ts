import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {ProgressBarModule} from "angular-progress-bar";
import { DmapTableComponent } from './directives/dmap-table/dmap-table.component';
import { DMAPFilterPipe } from '../common/Pipes/dmapFilter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { DmapAccordianComponent } from './directives/dmap-accordian/dmap-accordian.component';
import { DmapChartsComponent } from './directives/dmap-charts/dmap-charts.component';
import { DmapBarsComponent } from './directives/dmap-bars/dmap-bars.component';
import { DmapStackChartsComponent } from './directives/dmap-stack-charts/dmap-stack-charts.component';
import { DmapSingleBarChartsComponent } from './directives/dmap-single-bar-charts/dmap-single-bar-charts.component';
import { DmapFloatingBarChartsComponent } from './directives/dmap-floating-bar-charts/dmap-floating-bar-charts.component';

import { DmapErrorCardsComponent } from './directives/dmap-error-cards/dmap-error-cards.component';
import { DmapMultiAxesChartsComponent } from './directives/dmap-multi-axes-charts/dmap-multi-axes-charts.component';

import { DragDropDirective } from './directives/dmap-upload-file/drag-drop.directive';
import { DmapUploadFileComponent } from './directives/dmap-upload-file/dmap-upload-file.component';

import { MultiFieldFilterPipe } from './Pipes/multi-field-filter.pipe';
import { MergePrioritySelectionModalComponent } from './Modal/merge-priority-selection-modal/merge-priority-selection-modal.component';
import { MaterialModule } from '../material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HorizontalStackChartComponent } from './directives/horizontal-stack-chart/horizontal-stack-chart.component';

import { ReadingTableKeysPipe } from './Pipes/reading-table-keys.pipe';
import { FormatCamelCaseSpecialCharacterStrPipe } from './Pipes/format-camel-case-special-character-str.pipe';
import { ShowLicenseDetailsComponent } from '../documentation/license/show-license-details/show-license-details.component';
import { SimpleProgressbarComponent } from './directives/simple-progressbar/simple-progressbar.component';
import { ShowPasswordComponent } from './directives/show-password/show-password.component';

import { ShowDmapNotificationsComponent } from '../documentation/notifications/show-dmap-notifications/show-dmap-notifications.component';

import { NodeSelectionComponent } from './Modal/node-selection/node-selection.component';
import { DbConfigComponent } from '../db-config/db-config.component';
import { DbListComponent } from '../db-list/db-list.component';

import { MasterAnalyticsDashboardComponent } from '../master/master-analytics-dashboard/master-analytics-dashboard.component';

import { HighchartsChartModule } from 'highcharts-angular';

import { AddServerDetailsComponentComponent } from './Modal/add-server-details-component/add-server-details-component.component';
import { DmapBackupProgressModalComponent } from './Modal/dmap-backup-progress-modal/dmap-backup-progress-modal.component';
import { BackupMinimiseWindowsComponent } from './Modal/backup-minimise-windows/backup-minimise-windows.component';
import { DmapBackupErrorModalComponent } from './Modal/dmap-backup-error-modal/dmap-backup-error-modal.component';
@NgModule({
  imports: [
    HighchartsChartModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    DmapTableComponent,
    DmapAccordianComponent,
    DMAPFilterPipe,
    MultiFieldFilterPipe,
    DmapAccordianComponent,
    DmapChartsComponent,
    DmapBarsComponent,
    DmapStackChartsComponent,
    DmapSingleBarChartsComponent,
    DmapFloatingBarChartsComponent,
   
    DmapErrorCardsComponent,
    DmapMultiAxesChartsComponent,
   
    DragDropDirective,
    DmapUploadFileComponent,
    
    MergePrioritySelectionModalComponent,

    HorizontalStackChartComponent,
 
    ReadingTableKeysPipe,
    FormatCamelCaseSpecialCharacterStrPipe,
    ShowLicenseDetailsComponent,
    SimpleProgressbarComponent,
    ShowPasswordComponent,
    
    ShowDmapNotificationsComponent,
    
    NodeSelectionComponent,
    DbConfigComponent,
   
    DbListComponent,
    DbConfigComponent,

    MasterAnalyticsDashboardComponent,
  
    AddServerDetailsComponentComponent,
    DmapBackupProgressModalComponent,
    BackupMinimiseWindowsComponent,
    DmapBackupErrorModalComponent,
  ],
  exports: [
    CommonModule,
    DmapTableComponent,
    DmapAccordianComponent,
    DmapUploadFileComponent,
    MultiFieldFilterPipe,
    MaterialModule,
    ShowPasswordComponent,
    SimpleProgressbarComponent,
    NgxPaginationModule,
    DbConfigComponent,
  
    DbListComponent,
    DbConfigComponent,
   
    MasterAnalyticsDashboardComponent,
  
    HighchartsChartModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
})
export class SharedModule {}
