import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePasswordComponent } from '../common/Modal/update-password/update-password.component';

@Component({
  selector: 'app-db-assessment',
  templateUrl: './db-assessment.component.html',
  styleUrls: ['./db-assessment.component.css'],
})
export class DbAssessmentComponent implements OnInit {
data: any;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  updatePassword(data) {
    const modalRef = this.modalService.open(UpdatePasswordComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = {
      title: 'Update Password',
      runId: data.runId,
      stage: data.stepStatus,
      step: data.step,
    };
    modalRef.result.then((result) => {});
  }
}
