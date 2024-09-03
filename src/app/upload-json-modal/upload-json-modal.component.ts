import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-upload-json-modal',
  templateUrl: './upload-json-modal.component.html',
  styleUrls: ['./upload-json-modal.component.css']
})
export class UploadJsonModalComponent {

  constructor() { }

  closeModal() {
    // Close the modal logic here
}

onFileDropped(event: DragEvent) {
    // Handle file drop event
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files?.length) {
        this.handleFileInput(files);
    }
}

onDragOver(event: DragEvent) {
    // Prevent default behavior
    event.preventDefault();
}

onFileSelected(event: any) {
    // Handle file selection via input
    const files = event.target.files;
    if (files.length) {
        this.handleFileInput(files);
    }
}

handleFileInput(files: FileList) {
    // Logic to handle file upload
}

uploadFile() {
    // Logic to upload file
}

}
