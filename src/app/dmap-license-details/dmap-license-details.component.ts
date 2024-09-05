import { Component, OnInit, Input, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-dmap-license-details',
  templateUrl: './dmap-license-details.component.html',
  styleUrls: ['./dmap-license-details.component.css'],
})
export class DmapLicenseDetailsComponent implements OnInit {
  @Input() data: any;
  tableData: any;

  headers: any[];
  constructor(
    private activeModal: NgbActiveModal,
    private _PopupDraggableService: PopupDraggableService,
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit() {
    this.getLicenseDetails();
    this._PopupDraggableService.enableDraggablePopup();
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  getWidthStyle(heading) {
    return heading.widthStyle;
  }

  getLicenseDetails() {
    this.sql2PgService.getLicenseDetails().subscribe((res) => {
      this.tableData = res;
      console.log('DMAP license details --> ', res);
    });
  }
}
