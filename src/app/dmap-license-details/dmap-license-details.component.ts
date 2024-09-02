import { Component, OnInit, Input, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';

@Component({
  selector: 'app-dmap-license-details',
  templateUrl: './dmap-license-details.component.html',
  styleUrls: ['./dmap-license-details.component.css'],
})
export class DmapLicenseDetailsComponent implements OnInit {
  @Input() data: any;

  headers: any[];
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  cancel() {
    this.activeModal.close('cancel');
  }

  getWidthStyle(heading) {
    return heading.widthStyle;
  }
}
