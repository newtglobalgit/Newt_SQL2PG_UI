import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseListService } from '../../Services/database-list.service';
import { PdfChartService } from '../../Services/pdf-chart.service';
import * as _ from 'underscore';
import { MergeTypeService } from '../../Services/merge-type.service';

@Component({
  selector: 'app-merge-priority-selection-modal',
  templateUrl: './merge-priority-selection-modal.component.html',
  styleUrls: ['./merge-priority-selection-modal.component.css']
})
export class MergePrioritySelectionModalComponent implements OnInit {
  @Input() data:any;
  itemsRemoved:any[] = [];
  priorities:any[] = [];
  sortedPriorities:any[] = [];

  constructor(private activeModal: NgbActiveModal, private databaseListService:DatabaseListService, private mergeTypeService:MergeTypeService) { }

  ngOnInit() {
    this.priorities = this.mergeTypeService.getMergeTpyes();
    this.getPrioritiesOrder(this.data);
  }

  getPrioritiesOrder(item){
    let runId = this.data.itemsSelected[0].runId;
    this.databaseListService.getPriorities({run_id: runId+''}).subscribe((res) => {
      if(res['status'] != 'Failed'){
        this.orderPriorityData(res[runId]);
      }      
    });
  }

  orderPriorityData(priorityResponse){
    for(let i in this.priorities){
      let priority = priorityResponse[this.priorities[i].value].split('_');
      this.priorities[i].level = parseInt(priority[1]);
    }

    this.sortedPriorities = _.sortBy(this.priorities, 'level');
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortedPriorities, event.previousIndex, event.currentIndex);
  }

  submitMergeType(){
    let requestData = this.createRequest()
    
    this.databaseListService.savetPriorities(requestData).subscribe((res) => {
      this.activeModal.close({status:'ok', itemsRemoved:this.itemsRemoved});
    });
  }

  createRequest(){
    let requestData = {}
    let _priorities = {};
    for(let i in this.sortedPriorities){
      let index = parseInt(i)+1;
      _priorities[this.sortedPriorities[i].value] = "priority_"+index;
    }

    for(let i in this.data.itemsSelected){
      requestData[this.data.itemsSelected[i].runId] = _priorities
    }

    return requestData;
  }

  removeSelectedSchema(runId){
    let index = _.findIndex(this.data.itemsSelected, {runId: runId});

    if(index != -1){
      this.itemsRemoved.push(this.data.itemsSelected[index]);
      this.data.itemsSelected.splice(index, 1);
    }

    if(this.data.itemsSelected.length == 0){
      this.activeModal.close({status:'cancel', itemsRemoved:this.itemsRemoved});      
    }
  }
  

  cancel() {
    this.activeModal.close({status:'cancel', itemsRemoved:this.itemsRemoved});
  }
}
