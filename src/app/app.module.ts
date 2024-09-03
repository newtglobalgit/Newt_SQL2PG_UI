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

import { FooterComponent } from './common/Footer/footer/footer.component';
import { LoginComponent } from './login/login.component';

import { MaterialModule } from './material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppConfigService } from './common/Services/app-config.service';

import { TitleCasePipe } from '@angular/common';
import { RetryOnFailedConnectionInterceptor } from './common/Interceptors/FailedConnection';

import { ValidateEqualModule } from 'ng-validate-equal';
import { NgbdConfirmationModal } from './common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DbSetupComponent } from './db-setup/db-setup.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { DbAssessmentComponent } from './db-assessment/db-assessment.component';

import { ChatGptIntegrationComponent } from './chat-gpt-integration/chat-gpt-integration.component';

import { DmapVersionDetailsComponent } from './dmap-version-details/dmap-version-details.component';
import { DmapLicenseDetailsComponent } from './dmap-license-details/dmap-license-details.component';
import { UploadJsonModalComponent } from './upload-json-modal/upload-json-modal.component';


export function appInit(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoginComponent,
    DbSetupComponent,
    SideNavBarComponent,
    DbAssessmentComponent,

    ChatGptIntegrationComponent,

    NgbdConfirmationModal,
    DmapVersionDetailsComponent,
    DmapLicenseDetailsComponent,
    UploadJsonModalComponent,

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

    TitleCasePipe,
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
