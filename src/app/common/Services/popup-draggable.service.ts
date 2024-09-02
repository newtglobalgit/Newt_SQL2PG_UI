import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import 'jqueryui';

@Injectable({
  providedIn: 'root'
})
export class PopupDraggableService {

  constructor() { }
  enableDraggablePopup() {
    $(document).ready(function(){
      let modalContent: any = $('.modal-content');
      let modalHeader = $('.modal-header');
      modalHeader.addClass('cursor-all-scroll');
      modalContent.draggable({
          handle: '.modal-header',
          containment: "ngb-modal-window"
      });
    });
  }
}
