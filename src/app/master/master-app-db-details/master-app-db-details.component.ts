import { Component, Input, OnInit } from '@angular/core';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import * as _ from 'underscore';
import * as ld from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { ShortQuestionnaireComponent } from '../questionnaires/short-questionnaire/short-questionnaire.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { DbDetailsComponent } from '../questionnaires/db-details/db-details.component';
import { MenuMappingService } from 'src/app/common/Services/menu-mapping.service';

@Component({
  selector: 'app-master-app-db-details',
  templateUrl: './master-app-db-details.component.html',
  styleUrls: ['./master-app-db-details.component.css'],
})
export class MasterAppDbDetailsComponent implements OnInit {
  @Input() appDbDetailsData: any;
  @Input() showDashboardData: any;
  @Input() tcoLabel: any;
  @Input() tcoStatus: any;
  enableRunDBAnalytics:boolean = false;

  filterApplied: boolean = false;
  copiedAppDbDetailsData: any = [];
  originalData: any = [];

  constructor(
    private modalService: NgbModal,
    private databaseListService: DatabaseListService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private menuMapping: MenuMappingService
  ) {}

  menuMappingValue: any = [];
  searchappDbDetailsTable: string;

  isappQuestionnaireChecked: boolean = false;
  isdbQuestionnaireChecked: boolean = false;
  istcoQuestionnaireChecked: boolean = false;
  isdbScriptsChecked: boolean = false;
  masterAppDbDetailsIntervalCalls: any;
  analyticDBAnalyticsCalls:any;
  pa: number = 1;

  appId: any = [];
  appName: any = [];
  dbName: any = [];
  selectedValuesDict: { [key: string]: string[] } = {};

  ngOnInit() {
    this.getRunDBAnalyticsButtonState();
    this.menuMapping.getMenuAndPageMapping().subscribe((data) => {
    if (data) {
        this.menuMappingValue = data;
      } else {
          console.error('menu data issue..');
        }
      });
      //console.log('menuMappingValue',this.menuMappingValue);
    this.load_data();
    //this.spinner.show();
    this.masterAppDbDetailsIntervalCalls = setInterval(() => {
      if (!this.filterApplied) {
        this.load_data();
      }
    }, 30000);

    this.getRunDBAnalyticsButtonState();
    this.analyticDBAnalyticsCalls = setInterval(() => {
      this.getRunDBAnalyticsButtonState();
    }, 5000);
  }
  ngOnChanges() {
    this.load_data();
  }

  ngOnDestroy(): void {
    clearInterval(this.masterAppDbDetailsIntervalCalls);
    clearInterval(this.analyticDBAnalyticsCalls);
  }

  getRunDBAnalyticsButtonState(){
    this.databaseListService.getEnableRunAnalytics().subscribe((res)=>{
      //this.enableRunDBAnalytics = true;
      if(res.allowed){
        this.enableRunDBAnalytics = false;
       }
       else{
        this.enableRunDBAnalytics = true;
       }
    });
  }
  load_data() {
    //this.spinner.show();
    this.databaseListService.getAppDBDetails().subscribe((data) => {
      if (data.status == 'success') {
        this.appId = [];
        this.appName = [];
        this.dbName = [];
        this.appDbDetailsData = data.data;
        this.originalData = ld.cloneDeep(this.appDbDetailsData);
        this.copiedAppDbDetailsData = JSON.parse(JSON.stringify(this.appDbDetailsData));
        this.copiedAppDbDetailsData.bunits.forEach(ele => {
          if (ele && ele[ele.bunit] && ele[ele.bunit].length > 0) {
            ele[ele.bunit].forEach(row => {
              if (row && row.appId) {
                this.appId.push(row.appId);
              }
              if (row && row.appName) {
                this.appName.push(row.appName);
              }
              if (row && row[row.appName] && row[row.appName].length > 0) {
                row[row.appName].forEach(db => {
                  this.dbName.push(db.dbName);
                });
              }
            });
          }
        });
        this.appId = [...new Set(this.appId)];
        this.appName = [...new Set(this.appName)];
        this.dbName = [...new Set(this.dbName)];
        this.tcoStatus = this.appDbDetailsData['tcoStatus'];
        if (this.appDbDetailsData['tcoStatus'] == 'Not Started') {
          this.tcoLabel = 'Enter TCO Details';
        } else {
          this.tcoLabel = 'Update TCO Details';
        }
        if (Object.keys(this.appDbDetailsData).length == 0) {
          this.showDashboardData = false;
        } else {
          this.showDashboardData = true;
        }
      } else {
        this.appDbDetailsData = {};
      }

      this.spinner.hide();
    });
  }
  refresh() {
    this.load_data();
  }

  runDBAnalytics(){
    this.enableRunDBAnalytics = true;
    let reqObj = {"dbs":"all","awr_frequency":'30days'};
    this.databaseListService.runDBAnalytics(reqObj).subscribe((res)=>{
      if(res['status'] == 'success'){
        this.openAlert('Run DB Analytics Successful');
      } else {
        this.openAlert('Error running DB Analytics');
      }
      
    })
  }

  onDropdownClick(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    // Check if the clicked element is a checkbox
    if (target.tagName === 'INPUT' && target.type === 'checkbox') {
      // Get the value of the clicked checkbox
      const clickedValue = target.value;
      // this.selectedValues.push(clickedValue);
      const thElement = target.closest('th');
      const stageText = thElement
        .querySelector('span.marginRight5.defaultCursor')
        ?.textContent?.trim();
      // Check if the selected values dictionary already has an entry for the current stage text
      if (target.checked) {
        if (this.selectedValuesDict.hasOwnProperty(stageText)) {
          this.selectedValuesDict[stageText].push(clickedValue);
        } else {
          this.selectedValuesDict[stageText] = [clickedValue];
        }
      } else {
        // If the checkbox is unchecked, remove the clicked value from the selectedValuesDict
        if (this.selectedValuesDict.hasOwnProperty(stageText)) {
          this.selectedValuesDict[stageText] = this.selectedValuesDict[
            stageText
          ].filter((value) => value !== clickedValue);
          if (this.selectedValuesDict[stageText].length === 0) {
            delete this.selectedValuesDict[stageText];
          }
        }
      }
      // let filteredData = [];
      let tempObj = [];
      if (Object.keys(this.selectedValuesDict).length != 0) {
        let copyActualResponse;
        for (const stageText in this.selectedValuesDict) {
          if (this.selectedValuesDict.hasOwnProperty(stageText)) {
            const selectedValues = this.selectedValuesDict[stageText];
            let ret = [];
            copyActualResponse = JSON.parse(JSON.stringify(this.copiedAppDbDetailsData));
            copyActualResponse.bunits.map((item, index) => {
              if (stageText == 'Application ID') {
                ret = item[item['bunit']].filter((row) =>
                  selectedValues.includes(row.appId)
                );
              } else if (stageText == 'Application Name') {
                ret = item[item['bunit']].filter((row) =>
                  selectedValues.includes(row.appName)
                );
              } else if (stageText == 'Database Name') {
                ret = this.getFilteredRows(item[item['bunit']], selectedValues);
              }
              if (ret && ret.length > 0) {
                if (tempObj && tempObj.length>0) {
                  if (tempObj.filter(x => x.bunit == item.bunit).length > 0) {
                    this.checkItemExistence(ret, tempObj, index, item);
                  } else {
                    tempObj.push(
                      {
                        [item['bunit']] : [],
                        'bunit': item['bunit']
                      }
                    );
                    if (ret && ret.length>0) {
                      this.checkItemExistence(ret, tempObj, index, item);
                    }
                  }
                } else {
                  tempObj.push(
                    {
                      [item['bunit']] : [],
                      'bunit': item['bunit']
                    }
                  );
                  if (ret && ret.length>0) {
                    this.checkExistenceOfItem(ret, tempObj, item);
                  }
                }
                // }
              }
            });
          }
        }
        this.filterApplied = true;
        this.appDbDetailsData.bunits = tempObj;
      } else {
        this.filterApplied = false;
        this.appDbDetailsData = ld.cloneDeep(this.originalData);
      }
    }
  }

  search() {
    if (!this.searchappDbDetailsTable || this.searchappDbDetailsTable == "") {
      this.filterApplied = false;
      this.appDbDetailsData.bunits = this.originalData.bunits;
      return;
    } else {
      let tempObj = [];
      let ret = [];
      let copyActualResponse = JSON.parse(JSON.stringify(this.copiedAppDbDetailsData));
      copyActualResponse.bunits.map((item, index) => {
        ret = [];
        item[item['bunit']].map((row) => {
          Object.keys(row).forEach((obj) => {
            if(typeof(row[obj]) == 'string' && obj != "appQuestionnaire" && obj != "appContact" && row[obj].toLowerCase().includes(this.searchappDbDetailsTable.toLowerCase())) {
              let index = ret.findIndex(y => y[obj] == row[obj]);
              if (index == -1) {
                let obj = {...row};
                obj[obj['appName']] = [];
                ret.push(obj);
              }
            }
          });
          if (row[row['appName']] && row[row['appName']].length>0) {
            row[row['appName']].forEach(element => {
              Object.keys(element).forEach((x) => {
                if ((parseInt(this.searchappDbDetailsTable) && element[x] == parseInt(this.searchappDbDetailsTable))
                 || (typeof(element[x]) == 'string' && x != "dbContact" && x != "dbQuestionnaire" && x != "dbScripts" && element[x].toLowerCase().includes(this.searchappDbDetailsTable.toLowerCase()))) {
                  let obj = {...row};
                  obj[obj['appName']] = [];
                  obj[obj['appName']].push(element);
                  let index = ret.findIndex(x => x['appName'] == obj.appName);
                  if (index != -1) {
                    let anotherDB = obj[obj['appName']][0];
                    ret[index][ret[index]['appName']].push(anotherDB);
                  } else {
                    ret.push(obj);
                  }
                }
              });
            });
          }
        });
        if (ret && ret.length > 0) {
          ret = [...new Set(ret)];
          if (tempObj && tempObj.length>0) {
            if (tempObj.filter(x => x.bunit == item.bunit).length > 0) {
              this.checkItemExistence(ret, tempObj, index, item);
            } else {
              tempObj.push(
                {
                  [item['bunit']] : [],
                  'bunit': item['bunit']
                }
              );
              if (ret && ret.length>0) {
                this.checkItemExistence(ret, tempObj, index, item);
              }
            }
          } else {
            tempObj.push(
              {
                [item['bunit']] : [],
                'bunit': item['bunit']
              }
            );
            if (ret && ret.length>0) {
              this.checkExistenceOfItem(ret, tempObj, item);
            }
          }
          // }
        }
      });
      this.filterApplied = true;
      this.appDbDetailsData.bunits = tempObj;
    }
  }
  checkItemExistence(ret: any[], tempObj: any[], index: number, item: any) {
    ret.forEach((row) => {
      if (tempObj[index][item['bunit']]) {
        let itemExist = tempObj[index][item['bunit']].find(x => x.appName == row.appName);
        if (!itemExist) {
          tempObj[index][item['bunit']].push(row);
        }
      }
    });
  }

  checkExistenceOfItem(ret: any[], tempObj: any[], item: any) {
    ret.forEach((row) => {
      if (tempObj[0][item['bunit']]) {
        let itemExist = tempObj[0][item['bunit']].find(x => x.appName == row.appName);
        if (!itemExist) {
          tempObj[0][item['bunit']].push(row);
        }
      }
    });
  }
  getFilteredRows(allRows, selectedArr) {
    allRows = allRows.filter(x => x[x.appName].length>0);
    allRows.forEach((item) => {
      item[item.appName] = item[item.appName].filter(x => selectedArr.includes(x.dbName))
    });
    return allRows;
  }

  nextPageClick() {
    $('html, body').animate(
      {
        scrollTop: $('#dbMasterFirstAcc').offset().top,
      },
      'slow',
      'linear'
    );
  }

  onSelectFile(data) {
    if (data.file == 'appQuestionnaire') {
      this.isappQuestionnaireChecked = data.event.target.checked;
    } else if (data.file == 'dbQuestionnaire') {
      this.isdbQuestionnaireChecked = data.event.target.checked;
    } else if (data.file == 'tcoQuestionnaire') {
      this.istcoQuestionnaireChecked = data.event.target.checked;
    } else if (data.file == 'dbScripts') {
      this.isdbScriptsChecked = data.event.target.checked;
    }
  }

  openAlert(msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      // if (result === 'ok') {
      // }
    });
  }

  clearSearch() {
    this.searchappDbDetailsTable = '';
    this.filterApplied = false;
    this.appDbDetailsData.bunits = this.originalData.bunits;
  }

  downloadArtifacts() {
    let artifactsList = [];
    let filename;
    if (this.isappQuestionnaireChecked) {
      artifactsList.push('appQuestionnaire');
      filename = 'Application_Questionnaire.xlsx';
    }
    if (this.isdbQuestionnaireChecked) {
      artifactsList.push('dbQuestionnaire');
      filename = 'Database_Migration_Questionnaire.xlsx';
    }
    if (this.istcoQuestionnaireChecked) {
      artifactsList.push('tcoQuestionnaire');
      filename = 'TCOQuestionnaire.xlsx';
    }
    if (this.isdbScriptsChecked) {
      artifactsList.push('dbScripts');
      filename = 'db_scripts.zip';
    }
    if (artifactsList.length > 1) {
      filename = 'artifacts.zip';
    }

    if (artifactsList.length > 0) {
      let req = { artifacts: artifactsList };
      this.spinner.show();
      this.databaseListService.downloadArtifacts(req).subscribe((res) => {
        this.spinner.hide();
        if (res.type == 'application/json') {
          this.openAlert('File does not exists');
        } else {
          let blob = new Blob([res], {});
          saveAs.saveAs(blob, filename);
        }
      });
    } else {
      this.openAlert('Select at least one template to download.');
    }
  }
  editApplicationQuestionnaire() {
    //this.router.navigate(['/appQuestionnaire'], { queryParams: { appId: 'appId1' } } );
    // const link = this.router.serializeUrl(this.router.createUrlTree(['/appQuestionnaire'], { queryParams: { appId: 'appId1' } }));
    // window.open(link, '_blank');
  }

  editDbQuestionnaire() {}
  editDbScripts() {}
  editTcoQuestionnaire() {
    //const url = this.router.serializeUrl(this.router.createUrlTree(['/tcoQuestionnaire']));
    //window.open(url, '_blank');
    //this.router.navigate(['/tcoQuestionnaire']);
  }
  sendEmailReminder() {
    this.databaseListService.sendEmailReminderManually().subscribe((data) => {
      if ((data.status = 'success')) {
        this.openAlert('Reminder emails sent successfully.');
      } else {
        this.openAlert(data.message);
      }

      this.spinner.hide();
    });
  }

  openShortQuestionnaire() {
    const modalRef = this.modalService.open(ShortQuestionnaireComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = {};
    modalRef.result.then((result) => {
      // if (result === 'ok') {
      // }
    });
  }
  applicationAssessment() {}

  uploadDBDetails() {
    const modalRef = this.modalService.open(DbDetailsComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = { title: 'Enter Database Details' };
    modalRef.result.then((result) => {
      // if (result == 'ok') {
      // }
    });

    // let fileType = '';
    // let sampleFile = '';
    // let msg = '';
    // fileType = 'databaseDetails'
    // sampleFile = '/assets/sampleTemplates/Database_Details.xlsx'
    // msg = 'Please click the icon to browse or drag & drop excel file to upload database details.'

    // const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    // modalRef.componentInstance.data = {'fileType':fileType, 'sampleFile': sampleFile, 'isSampleFileShow':true,"message": msg};

    // modalRef.result.then((result) => {

    //     if ( result == 'ok') {
    //       this.openAlert('File uploaded successfully.');
    //   } else {
    //     if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
    //   }
    // });
  }
}
