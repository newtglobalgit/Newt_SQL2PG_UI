import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-file-upload',
  templateUrl: './simple-file-upload.component.html',
  styleUrls: ['./simple-file-upload.component.css']
})
export class SimpleFileUploadComponent implements OnInit {
  @Output() onFileUploadClicked = new EventEmitter<any>();

  files: File[] = [];
  filesData:any = [];
  uploadedFilePath: string = null;

  constructor(private spinner: NgxSpinnerService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  filesDropped(files) {
    for (let index = 0; index < files.length; index++) {
      const element = <File>files[index];

      this.files.push(element);
    }
    this.uploadFile();
  }

  attachFile(event) {
    this.deleteAttachment(0, false) //!important - add this line of code if single upload is needed

    this.filesDropped(event.target.files);
    this.uploadFile();
  }

  deleteAttachment(index, isbtnClicked) {
    this.files.splice(index, 1);
    if(isbtnClicked) this.onFileUploadClicked.emit({file:null, fileName:null});
  }

  uploadFile(){
    let obj = {}
    if(this.files.length == 0){
      return;
    }

    for(let i in this.files){
      const fd = new FormData();
      fd.append('file', this.files[i]);

       obj['file'] = fd;
       obj['fileName'] = this.files[i].name
       obj['fileData']=this.files;
       this.onFileUploadClicked.emit(obj);
    }
  }

  openAlertDialog() {
    // const dialogRef = this.dialog.open(AlertComponent, {
    //   width: '450px',
    //   data: {'msg': 'Draw.io strictly has to be a xml file!!'}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }
}
