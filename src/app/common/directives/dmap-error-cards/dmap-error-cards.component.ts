import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapMigrationErrorModal } from '../../Modal/dmap-migration-error-modal/dmap-migration-error-modal.component';
import { PdfChartService } from '../../Services/pdf-chart.service';

@Component({
  selector: 'app-dmap-error-cards',
  templateUrl: './dmap-error-cards.component.html',
  styleUrls: ['./dmap-error-cards.component.css']
})
export class DmapErrorCardsComponent implements OnInit {
  @Input() errorData:any;
  @Input() chartId:string;
  @Input() reportType:string;
  @Input() schemaData:any;
  @Input() commonData:any;

  constructor(private modalService: NgbModal, private pdfChartService:PdfChartService) { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if(this.errorData != undefined){
      for(let i in this.errorData){
        if(this.errorData[i].list.length > 0){
          let _data = {index:9, name:this.errorData[i].object, value:this.errorData[i].list, type:'error_table'}
          this.pdfChartService.setChartData(this.chartId, this.commonData, _data, this.reportType)
        }
      }
    }
  }

  openDetailErrorsModal(data){
    let errorData:any = {};

    errorData.headings = [{"name":'Id', "widthStyle":"10%"},
                          {"name":'Description', "widthStyle":"45%"},
                          {"name":'Recommendation Action', "widthStyle":"45%"}];
    errorData.content = data;

    const modalRef = this.modalService.open(DmapMigrationErrorModal,  {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = errorData;
    modalRef.result.then((result) => {
      // if ( result == 'ok') {

      // }else{

      // }
    });
  }

}
