import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  @Input() data: any;
  faqs = [
    { question: 'xlsx', answer: 'abc' },
    { question: 'pdf', answer: 'def' },
    { question: 'zip', answer: 'ghi' },
    { question: 'docx', answer: 'jkl' },
  ];

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.accordion();
  }

  accordion() {
    var acc = document.getElementsByClassName('accordion');
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }
  }

  cancel() {
    this.activeModal.close('cancel');
  }
}
