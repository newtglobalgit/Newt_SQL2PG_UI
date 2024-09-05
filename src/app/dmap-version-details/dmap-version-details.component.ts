import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-dmap-version-details',
  templateUrl: './dmap-version-details.component.html',
  styleUrls: ['./dmap-version-details.component.css'],
})
export class DmapVersionDetailsComponent implements OnInit {
  @Input() data: any;
  tableData: any;

  constructor(
    private activeModal: NgbActiveModal,
    private _PopupDraggableService: PopupDraggableService,
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit() {
    this.getDmapVersionDetails();
    this._PopupDraggableService.enableDraggablePopup();
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  getDmapVersionDetails() {
    this.sql2PgService.getDMAPVersionDetails().subscribe((res) => {
      this.tableData = res;
      console.log('DMAP Version details --> ', res);
    });
  }
}
