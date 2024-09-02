import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';

@Component({
  selector: 'app-dmap-version-details',
  templateUrl: './dmap-version-details.component.html',
  styleUrls: ['./dmap-version-details.component.css'],
})
export class DmapVersionDetailsComponent implements OnInit {
  @Input() data: any;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  cancel() {
    this.activeModal.close('cancel');
  }
}
