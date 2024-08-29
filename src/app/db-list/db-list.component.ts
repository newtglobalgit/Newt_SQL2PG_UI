import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from '@angular/core';
import { DatabaseListService } from '../common/Services/database-list.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { CommonServices } from '../common/Services/common-services.service';
import { Subscription, interval } from 'rxjs';
import { ifError } from 'assert';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-db-list',
  templateUrl: './db-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DbListComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
