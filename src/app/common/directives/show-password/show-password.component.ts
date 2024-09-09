import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-show-password',
  templateUrl: './show-password.component.html',
  styleUrls: ['./show-password.component.css']
})
export class ShowPasswordComponent implements OnInit {
  @Output() showPasswordClicked = new EventEmitter<string>();
  @Input() password:string;
  @Input() right:string;
  @Input() top:string;

  isShowPasswordText:boolean = false;
  passwordType:string = 'password';
  passwordTitle:string = 'Show password';

  constructor() { }

  ngOnInit() {
  }  


  showPassword() {
    this.isShowPasswordText = !this.isShowPasswordText;
 
    if (this.isShowPasswordText) {
      this.setPasswordVisibility('text', 'Hide password');
    } else {
      this.setPasswordVisibility('password', 'Show password');
    }
 
    this.showPasswordClicked.emit(this.passwordType);
  }
 
  private setPasswordVisibility(type: string, title: string): void {
    this.passwordType = type;
    this.passwordTitle = title;
  }

}
