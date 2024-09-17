import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from '../dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';
import { Sql2PgService } from '../../Services/sql2pg.service';

@Component({
  selector: 'app-dmap-multiple-schema-delete',
  templateUrl: './dmap-multiple-schema-delete.component.html',
  styleUrls: ['./dmap-multiple-schema-delete.component.css'],
})
export class DmapMultipleSchemaDeleteComponent implements OnInit {
  @Input() data: any;

  schemasToDelete: any[] = [];
  checkedSchemas: any[] = [];
  isAllRowChecked: number;
  p: number = 1;
  selected_schemas: any[] = [];
  showPagination: boolean = false;
  showSubmitButton: boolean = false;
  selectedSchema: any;
  showText: boolean = false;
  schemaConversionsubmittedcount: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private _PopupDraggableService: PopupDraggableService,
    private sql2PgService: Sql2PgService,
  ) {}

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    sessionStorage['assessmentSelectedDatabase'] = undefined;
    this.spinner.hide();
    this.ngOnChanges();
    for (let k in this.schemasToDelete) {
      if (this.schemasToDelete[k].runId == this.data.selectedSchema.runId) {
        this.schemasToDelete[k].isRowChecked =
          !this.schemasToDelete[k].isRowChecked;
      }
    }
    for (let j in this.schemasToDelete) {
      if (this.schemasToDelete[j].runId == this.data.selectedSchema.runId) {
        if (this.schemasToDelete[j]['status'] != 'Add') {
          this.checkedSchemas.push(this.data.selectedSchema.runId);
          this.showText = true;
        }
      }
    }

    if (
      this.checkedSchemas.length > 0 &&
      this.data.selectedSchema.runId != ''
    ) {
      this.showSubmitButton = true;
    }
  }
  ngOnChanges(): void {
    this.schemasToDelete = this.data['data'];

    if (this.schemasToDelete.length > 0) {
      this.showPagination = true;
    } else {
      this.showPagination = false;
    }

    this.setCheckboxes();

    this.setAllCheckBox();

    if (this.schemaConversionsubmittedcount == this.schemasToDelete.length) {
      this.showSubmitButton = true;
    }
  }
  setCheckboxes() {
    for (let i in this.schemasToDelete) {
      if (this.checkedSchemas.indexOf(this.schemasToDelete[i].runId) > -1) {
        this.schemasToDelete[i].isRowChecked = true;
      } else {
        this.schemasToDelete[i].isRowChecked = false;
      }
    }
  }
  onCheckboxClicked(data) {
    for (let k in this.schemasToDelete) {
      if (this.schemasToDelete[k].runId == this.data.selectedSchema.runId) {
        this.schemasToDelete[k].defaultSelection = false;
      }
    }
    for (let k in this.schemasToDelete) {
      if (this.schemasToDelete[k].runId == data.runId) {
        this.schemasToDelete[k].isRowChecked =
          !this.schemasToDelete[k].isRowChecked;
      }
    }
    if (data.runId == -1) {
      if (data.event.target.checked) {
        this.checkAll('add');
        this.showSubmitButton = true;
      } else {
        this.checkAll('remove');
        this.showSubmitButton = false;
      }
    } else if (this.checkedSchemas.indexOf(data.runId) > -1) {
      this.checkedSchemas.splice(this.checkedSchemas.indexOf(data.runId), 1);
      this.setAllCheckBox();
    } else {
      this.checkedSchemas.push(data.runId);
      this.setAllCheckBox();
    }

    if (this.checkedSchemas.length > 0) {
      this.showSubmitButton = true;
    } else {
      this.showSubmitButton = false;
    }
  }
  setAllCheckBox() {
    /* check the selectAll checkbox if a user select all the checkboxes one by one */
    let _schemaList = this.schemasToDelete.filter(function (item) {
      return item.isRowChecked || item.defaultSelection;
    });
    if (
      _schemaList.length == this.schemasToDelete.length &&
      this.schemasToDelete.length > 0
    ) {
      this.isAllRowChecked = -1;
      this.showSubmitButton = true;
    } else {
      this.isAllRowChecked = undefined;
      this.showSubmitButton = false;
    }
  }
  checkAll(action) {
    for (let i in this.schemasToDelete) {
      if (
        action == 'add' &&
        this.checkedSchemas.indexOf(this.schemasToDelete[i].runId) == -1
      ) {
        this.checkedSchemas.push(this.schemasToDelete[i].runId);
      } else if (action == 'remove') {
        this.checkedSchemas.splice(
          this.checkedSchemas.indexOf(this.schemasToDelete[i].runId),
          1
        );
      }
    }

    this.setCheckboxes();
  }
  cancel() {
    this.activeModal.close('cancel');
  }
  openAlert(msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }
  submit() {
    let reqObj = [];
    let runIds;
    for (let i in this.schemasToDelete) {
      for (let j in this.checkedSchemas) {
        if (this.schemasToDelete[i].runId == this.checkedSchemas[j]) {
          if (this.schemasToDelete[i].assigned_vm == null) {
            this.schemasToDelete[i].assigned_vm = 'VM0';
          }
          reqObj.push({
            runId: this.schemasToDelete[i].runId,
            assigned_vm: this.schemasToDelete[i].assigned_vm,
          });
        }
      }
    }

    if (reqObj.length > 0) {
      runIds = reqObj.reduce(function (r, a) {
        r[a.assigned_vm] = r[a.assigned_vm] || [];
        r[a.assigned_vm].push(a);
        return r;
      }, Object.create(null));
    } else {
      this.openAlert('Please select atleast one schema to delete.');
    }
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'Are you sure you want to delete selected schemas?',
      title: 'Confirmation',
      okButtonLabel: 'Yes',
      cancelButtonLabel: 'No',
      label: 'moveToCompletion',
    };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        this.spinner.show();
        let selecteDatabase_ = sessionStorage.getItem(
          'assessmentSelectedDatabase'
        );
        let selecteDatabase;

        if (selecteDatabase_ != undefined && selecteDatabase_ != 'undefined') {
          selecteDatabase = JSON.parse(selecteDatabase_);
        } else {
          selecteDatabase = null;
        }

        let selectedRunId = '';

        if (selecteDatabase) {
          selectedRunId = selecteDatabase['runId'];

          if (this.checkedSchemas.includes(selectedRunId)) {
            sessionStorage['assessmentSelectedDatabase'] = undefined;
          }
        }

        this.sql2PgService
          .mutiple_schema_delete({ RUN_IDS: runIds })
          .then((data) => {
            if (data.status == 'success') {
              // this.spinner.hide();
              this.activeModal.close('ok');
              window.location.reload();
              this.openAlert('Selected schema(s) deleted successfully.');
            } else {
              // this.spinner.hide();
              this.openAlert(data.message);
            }
          })
          .catch((err) => {
            this.spinner.hide();
          })
          .finally(() => this.spinner.hide());
      }
    });
  }
}
