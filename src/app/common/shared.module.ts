import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DMAPFilterPipe } from '../common/Pipes/dmapFilter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

import { MultiFieldFilterPipe } from './Pipes/multi-field-filter.pipe';
import { MaterialModule } from '../material-module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReadingTableKeysPipe } from './Pipes/reading-table-keys.pipe';
import { FormatCamelCaseSpecialCharacterStrPipe } from './Pipes/format-camel-case-special-character-str.pipe';

import { HighchartsChartModule } from 'highcharts-angular';

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
    DMAPFilterPipe,
    MultiFieldFilterPipe,

    ReadingTableKeysPipe,
    FormatCamelCaseSpecialCharacterStrPipe,
  ],
  exports: [
    CommonModule,

    MultiFieldFilterPipe,
    MaterialModule,

    NgxPaginationModule,

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
