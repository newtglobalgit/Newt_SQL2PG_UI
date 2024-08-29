import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './common/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EventEmitterService } from './common/Services/event-emitter.service';
import { NgbdConfirmationModal } from './common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DmapAlertDialogModal } from './common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DmapDataAlertDialogComponent } from './common/Modal/dmap-data-alert-dialog/dmap-data-alert-dialog.component';
import { DmapMigrationErrorModal } from './common/Modal/dmap-migration-error-modal/dmap-migration-error-modal.component';
import { DmapOra2pgErrorModalComponent } from './common/Modal/dmap-ora2pg-error-modal/dmap-ora2pg-error-modal.component';
import { DmapTargetCredtialsModal } from './common/Modal/dmap-target-credtials-modal/dmap-target-credtials-modal.component';
import { FooterComponent } from './common/Footer/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { FileUploadModalComponent } from './common/Modal/file-upload-modal/file-upload-modal.component';
import { PerformaceBenchFileUploadModalComponent } from './common/Modal/performace-bench-file-upload-modal/performace-bench-file-upload-modal.component';
import { ConfigCICDModalComponent } from './common/Modal/config-cicdmodal/config-cicdmodal.component';
import { DmapSettingsComponent } from './common/Modal/dmap-settings/dmap-settings.component';
import { DmapParamsModalComponent } from './common/Modal/dmap-params-modal/dmap-params-modal.component';
import { DmapPartitionsDetailComponent } from './common/Modal/dmap-partitions-detail/dmap-partitions-detail.component';
import { MergePrioritySelectionModalComponent } from './common/Modal/merge-priority-selection-modal/merge-priority-selection-modal.component';
import { MaterialModule } from './material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppConfigService } from './common/Services/app-config.service';
import { DmapUpdatePasswordComponent } from './common/Modal/dmap-update-password/dmap-update-password.component';
import { DmapBackupModalComponent } from './common/Modal/dmap-backup-modal/dmap-backup-modal.component';
import { ReqHeaderAndErrorHandlingInterceptor } from './common/Interceptors/no-chache';
import { TitleCasePipe } from '@angular/common';
import { DmapUpdateThresholdComponent } from './common/Modal/dmap-update-threshold/dmap-update-threshold.component';
import { RetryOnFailedConnectionInterceptor } from './common/Interceptors/FailedConnection';
import { FormatCamelCaseSpecialCharacterStrPipe } from './common/Pipes/format-camel-case-special-character-str.pipe';
import { LicenseActivationComponent } from './documentation/license/license-activation/license-activation.component';
import { ShowLicenseDetailsComponent } from './documentation/license/show-license-details/show-license-details.component';
import { DataMigrationSettingsModalComponent } from './common/Modal/data-migration-settings-modal/data-migration-settings-modal.component';
import { MultiSelectListComponent } from './common/directives/multi-select-list/multi-select-list.component';
import { SimpleFileUploadComponent } from './common/directives/simple-file-upload/simple-file-upload.component';
import { UploadConfFileModalComponent } from './common/Modal/upload-conf-file-modal/upload-conf-file-modal.component';
import { DataMigrationDumpDataModalComponent } from './common/Modal/data-migration-dump-data-modal/data-migration-dump-data-modal.component';
import { DragDropDirectiveSimpleUpload } from './common/directives/simple-file-upload/drag-drop.directive';
import { ValidateEqualModule } from 'ng-validate-equal';
import { ShowDmapNotificationsComponent } from './documentation/notifications/show-dmap-notifications/show-dmap-notifications.component';
import { DmapBatchDetailsComponent } from './common/Modal/dmap-batch-details/dmap-batch-details.component';
import { MasterHomeComponent } from './master/master-home/master-home.component';
import { DmapAddMasterNodeComponent } from './common/Modal/dmap-add-worker-node/dmap-add-worker-node.component';
import { DmapMasterSettingsModalComponent } from './common/Modal/dmap-master-settings-modal/dmap-master-settings-modal.component';
import { DmapMasterEmailSettingsModalComponent } from './common/Modal/dmap-master-email-settings-modal/dmap-master-email-settings-modal.component';
import { AssessmentLogsComponent } from './common/Modal/assessment-logs/assessment-logs.component';
import { DblinkViewComponent } from './common/Modal/dblink-view/dblink-view.component';
import { UpdateDblinkModalComponent } from './common/Modal/update-dblink-modal/update-dblink-modal.component';
import { MasterAppDbDetailsComponent } from './master/master-app-db-details/master-app-db-details.component';
import { ApplicationQuestionnaireComponent } from './master/questionnaires/application-questionnaire/application-questionnaire.component';
import { DatabaseQuestionnaireComponent } from './master/questionnaires/database-questionnaire/database-questionnaire.component';
import { TcoQuestionnaireComponent } from './master/questionnaires/tco-questionnaire/tco-questionnaire.component';
import { DbScriptsComponent } from './master/questionnaires/db-scripts/db-scripts.component';
import { DmapProdDbDetailsComponent } from './common/Modal/dmap-prod-db-details/dmap-prod-db-details.component';
import { SchemaMigrationConfirmationModalComponent } from './common/Modal/schema-migration-confirmation-modal/schema-migration-confirmation-modal.component';
import { QuestioaireTemplateComponent } from './master/questionnaires/questioaire-template/questioaire-template.component';
import { FunctionalDetailsComponent } from './master/questionnaires/database-questionnaire/functional-details/functional-details.component';
import { DatabaseDetailsComponent } from './master/questionnaires/database-questionnaire/database-details/database-details.component';
import { ShortQuestionnaireComponent } from './master/questionnaires/short-questionnaire/short-questionnaire.component';
import { ShortQuestionnaireTemplateComponent } from './master/questionnaires/short-questionnaire/short-questionnaire-template/short-questionnaire-template.component';
import { DmapMultipleSchemaDeleteComponent } from './common/Modal/dmap-multiple-schema-delete/dmap-multiple-schema-delete.component';
import { ApplicationAssessmentQuestionnaireComponent } from './master/questionnaires/application-assessment-questionnaire/application-assessment-questionnaire.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceListComponent } from './master/questionnaires/interface-list/interface-list.component';
import { AddInterfaceComponent } from './common/Modal/add-interface/add-interface.component';
import { DbDetailsComponent } from './master/questionnaires/db-details/db-details.component';
import { DbDetailsTemplateComponent } from './master/questionnaires/db-details/db-details-template/db-details-template.component';
import { AppServerDetailsComponent } from './master/questionnaires/app-server-details/app-server-details.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { ContactUsComponent } from './documentation/contact-us/contact-us.component';
import { FaqComponent } from './documentation/faq/faq.component';
import { DmapAwrConfirmationComponent } from './common/Modal/dmap-awr-confirmation/dmap-awr-confirmation.component';


export function appInit(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NgbdConfirmationModal,
    DmapAlertDialogModal,
    DmapDataAlertDialogComponent,
    DmapMigrationErrorModal,
    DmapOra2pgErrorModalComponent,
    DmapTargetCredtialsModal,
    FileUploadModalComponent,
    FooterComponent,
    LoginComponent,
    AboutComponent,
    DocumentationComponent,
    PerformaceBenchFileUploadModalComponent,
    ConfigCICDModalComponent,
    DmapSettingsComponent,
    DmapParamsModalComponent,
    DmapPartitionsDetailComponent,
    DmapUpdatePasswordComponent,
    DmapBackupModalComponent,
    DmapUpdateThresholdComponent,
    LicenseActivationComponent,
    DataMigrationSettingsModalComponent,
    MultiSelectListComponent,
    SimpleFileUploadComponent,
    UploadConfFileModalComponent,
    DataMigrationDumpDataModalComponent,
    DragDropDirectiveSimpleUpload,
    DmapBatchDetailsComponent,
    MasterHomeComponent,
    DmapAddMasterNodeComponent,
    DmapMasterSettingsModalComponent,
    DmapMasterEmailSettingsModalComponent,
    AssessmentLogsComponent,
    DblinkViewComponent,
    UpdateDblinkModalComponent,
    MasterAppDbDetailsComponent,
    ApplicationQuestionnaireComponent,
    DatabaseQuestionnaireComponent,
    TcoQuestionnaireComponent,
    DbScriptsComponent,
    DmapProdDbDetailsComponent,
    SchemaMigrationConfirmationModalComponent,
    QuestioaireTemplateComponent,
    FunctionalDetailsComponent,
    DatabaseDetailsComponent,
    ShortQuestionnaireComponent,
    ShortQuestionnaireTemplateComponent,
    DmapMultipleSchemaDeleteComponent,
    ApplicationAssessmentQuestionnaireComponent,
    InterfaceListComponent,
    AddInterfaceComponent,
    DbDetailsComponent,
    DbDetailsTemplateComponent,
    AppServerDetailsComponent,
    SideNavBarComponent,
    ContactUsComponent,
    FaqComponent,
    DmapAwrConfirmationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbModule,
    NgxSpinnerModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ValidateEqualModule,
  ],
  providers: [
    NgbActiveModal,
    FormatCamelCaseSpecialCharacterStrPipe,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppConfigService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryOnFailedConnectionInterceptor,
      multi: true,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ReqHeaderAndErrorHandlingInterceptor,
    //   multi: true,
    // },
    EventEmitterService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    TitleCasePipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NgbdConfirmationModal,
    DmapAlertDialogModal,
    DmapDataAlertDialogComponent,
    DmapMigrationErrorModal,
    DmapOra2pgErrorModalComponent,
    DmapTargetCredtialsModal,
    FileUploadModalComponent,
    PerformaceBenchFileUploadModalComponent,
    ConfigCICDModalComponent,
    DmapSettingsComponent,
    DmapParamsModalComponent,
    DmapPartitionsDetailComponent,
    MergePrioritySelectionModalComponent,
    DmapUpdatePasswordComponent,
    DmapUpdateThresholdComponent,
    DmapBackupModalComponent,
    ShowLicenseDetailsComponent,
    DataMigrationSettingsModalComponent,
    DataMigrationDumpDataModalComponent,
    UploadConfFileModalComponent,
    ShowDmapNotificationsComponent,
    DmapBatchDetailsComponent,
    DmapAddMasterNodeComponent,
    DmapMasterSettingsModalComponent,
    DmapMasterEmailSettingsModalComponent,
    AssessmentLogsComponent,
    DblinkViewComponent,
    UpdateDblinkModalComponent,
    DmapProdDbDetailsComponent,
    SchemaMigrationConfirmationModalComponent,
    ShortQuestionnaireComponent,
    DmapMultipleSchemaDeleteComponent,
    AddInterfaceComponent,
    DmapAwrConfirmationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
