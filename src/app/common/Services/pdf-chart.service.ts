import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormatCamelCaseSpecialCharacterStrPipe } from '../Pipes/format-camel-case-special-character-str.pipe';

@Injectable({
  providedIn: 'root',
})
export class PdfChartService {
  chartData: any[] = [];
  schemaDetail: any;

  constructor(
    private spinner: NgxSpinnerService,
    private formatCamelCaseSpecialCharacterStrPipe: FormatCamelCaseSpecialCharacterStrPipe
  ) {}

  setChartData(runId: string, schemaData: any, chart: any, reportType: string) {
    let chart_array: any[] = [];
    let chart_data_obj: any;

    let _chartData = this.chartData.filter(function (item) {
      return item.runId == runId && item.reportType == reportType;
    });

    if (_chartData.length == 0) {
      chart_array.push({
        index: chart.index,
        name: chart.name,
        chart: chart.value,
        type: chart.type,
      });
      chart_data_obj = {
        runId: runId,
        schemaData: schemaData,
        reportType: reportType,
        charts: chart_array,
      };

      this.chartData.push(chart_data_obj);
    } else {
      let index = _.findIndex(_chartData[0].charts, {
        name: chart.name,
        chart: chart.value,
      });

      if (index == -1) {
        _chartData[0].charts.push({
          index: chart.index,
          name: chart.name,
          chart: chart.value,
          type: chart.type,
        });
      }
    }
  }

  removeChart(runId: any) {
    let index = _.findIndex(this.chartData, { runId: runId });
    if (index >= 0) {
      this.chartData.splice(index, 1);
    }
  }

  getSchemaDetail(runId: any, reportType: any) {
    let schemaData = this.getChartData(runId, reportType).schemaData;

    return schemaData;
  }

  getChartData(runId: any, reportType: any) {
    let _chartData = this.chartData.filter(function (item) {
      return item.runId == runId && item.reportType == reportType;
    });

    _.sortBy(_chartData, 'index');
    return _chartData[0];
  }

  getCharPromises(runId: any, reportType: any) {
    let charPromise: any[] = [];
    let chartData = this.getChartData(runId, reportType);

    let _chartData = chartData.charts.filter(function (item: any) {
      return item.type == 'chart';
    });

    for (let i in _chartData) {
      if (i == '0') {
        charPromise.push(_chartData[i].chart.exporting.pdfmake);
        charPromise.push(_chartData[i].chart.exporting.getImage('png'));
      } else {
        charPromise.push(_chartData[i].chart.exporting.getImage('png'));
      }
    }
    return charPromise;
  }

  getValidationData(runId: any, reportType: any) {
    let chartData = this.getChartData(runId, reportType);

    let _data = chartData.charts.filter(function (item: any) {
      return item.type == 'validation_table';
    });
    let final_array_index = _data.length;
    return _data[final_array_index - 1].chart;
  }

  getErrorData(runId: any, reportType: any) {
    let chartData = this.getChartData(runId, reportType);

    let _data = chartData.charts.filter(function (item: any) {
      return item.type == 'errors_table';
    });

    let final_array_index = _data.length;
    if (final_array_index > 0) {
      return _data[final_array_index - 1].chart;
    } else {
      return;
    }
  }

  createAnalysisTable(data: any, reportType: any) {
    let row: any[] = [];
    let rows: any[] = [];
    let bold: boolean;
    // row = [];

    if (reportType == 'Assessment') {
      row = [
        {
          text: 'Object Type',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Valid Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Invalid Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Assessed Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Simple Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Medium Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Complex Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Very Complex Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
      ];
    } else {
      row = [
        {
          text: 'Object Type',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Valid Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Invalid Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Assessed Objects',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Lines of Code',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
      ];
    }
    rows.push(row);

    for (let j in data) {
      if (data[j]['type'] != 'Grand Total') {
        bold = false;
        row = [];

        if (reportType == 'Assessment') {
          row.push(
            {
              text: data[j]['type'],
              fillColor: '#dceafa',
              fontSize: 10,
              bold: true,
              colSpan: 8,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {}
          );
        } else {
          row.push(
            {
              text: data[j]['type'],
              fillColor: '#dceafa',
              fontSize: 10,
              bold: true,
              colSpan: 5,
            },
            {},
            {},
            {},
            {}
          );
        }
        rows.push(row);
      } else {
        bold = true;
      }

      let storageData = data[j]['objectAnalysis'];
      for (let i in storageData) {
        if (storageData[i]['objectType'] == 'Total') {
          bold = true;
        }
        row = [];

        if (reportType == 'Assessment') {
          row.push(
            {
              text: storageData[i]['objectType'],
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['validType'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['inValidType'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['assessedObjects'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['simpleObjects'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['mediumObjects'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['difficultObjects'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['complexObjects'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            }
          );
        } else {
          row.push(
            {
              text: storageData[i]['objectType'],
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['validType'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['inValidType'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['assessedObjects'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            },
            {
              text: storageData[i]['lineOfCode'],
              alignment: 'center',
              fontSize: 10,
              bold: bold,
              border: [true, true, true, true],
            }
          );
        }
        rows.push(row);
      }
    }

    let columnWidth;
    if (reportType == 'Assessment') {
      columnWidth = [100, 50, 50, 50, 50, 50, 50, 50];
    } else {
      columnWidth = ['*', '*', '*', '*', '*'];
    }

    let table = {
      widths: columnWidth,
      body: rows,
    };
    return table;
  }

  createSimpleTable(data: any) {
    let row: any[] = [];
    let rows: any[] = [];
    let columnCount: number = 0;

    row = [];

    for (let i in data[0]) {
      let textAlign = '';
      if (i == 'dependentObjectCount') {
        textAlign = 'center';
      }
      row.push({
        text: this.formatCamelCaseSpecialCharacterStrPipe.transform(i),
        alignment: textAlign,
        style: 'tableHeader',
        color: 'white',
        fillColor: '#274584',
        fontSize: 10,
        bold: true,
      });
      columnCount++;
    }
    rows.push(row);

    for (let i in data) {
      row = [];
      for (let key in data[i]) {
        let textAlign = '';
        if (key == 'dependentObjectCount') {
          textAlign = 'center';
        } else {
          textAlign = 'left';
        }

        row.push({
          text: data[i][key],
          alignment: textAlign,
          fontSize: 10,
          bold: false,
          border: [true, true, true, true],
        });
      }
      rows.push(row);
    }

    let columnWidth = [];
    for (let i = 0; i < columnCount; i++) {
      columnWidth.push('*');
    }

    let table = {
      widths: columnWidth,
      body: rows,
    };
    return table;
  }

  createMigrationSequenceTable(data: any) {
    let row: any[] = [];
    let rows: any[] = [];
    let columnCount: number = 0;

    row = [];
    if (data) {
      for (let i in data[0]) {
        let textAlign = '';
        if (i == 'sequence') {
          textAlign = 'center';
        }
        row.push({
          text: this.formatCamelCaseSpecialCharacterStrPipe.transform(i),
          alignment: textAlign,
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        });
        columnCount++;
      }
      rows.push(row);

      for (let i in data) {
        row = [];
        for (let key in data[i]) {
          let textAlign = '';
          if (key == 'sequence') {
            textAlign = 'center';
          } else {
            textAlign = 'left';
          }

          row.push({
            text: data[i][key],
            alignment: textAlign,
            fontSize: 10,
            bold: false,
            border: [true, true, true, true],
          });
        }
        rows.push(row);
      }

      let columnWidth = [];
      for (let i = 0; i < columnCount; i++) {
        columnWidth.push('*');
      }

      let table = {
        widths: columnWidth,
        body: rows,
      };
      return table;
    }
  }

  createBatchSchemaDetailsTable(data: any) {
    let row: any[] = [];
    let rows: any[] = [];
    let bold: boolean = false;
    // row = [];

    if (data) {
      row = [
        {
          text: 'Run ID',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Version',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Source DB',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Source DB Size',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
      ];

      rows.push(row);

      for (let i in data) {
        row = [];
        row.push(
          {
            text: data[i]['Run ID'],
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          },
          {
            text: data[i]['Version'],
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          },
          {
            text: data[i]['Source DB'],
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          },
          {
            text: data[i]['Source DB Size'],
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          }
        );

        rows.push(row);
      }
      let table = {
        widths: [80, '*', 250, 50],
        body: rows,
      };
      return table;
    }
  }

  createBatchDetailsTable(data: any) {
    let row: any[] = [];
    let rows: any[] = [];
    row = [];
    if (data) {
      row.push(
        {
          text: 'Batch ID',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
          border: [true, true, true, false],
        },
        {
          text: data['batch_ID'],
          fontSize: 10,
          border: [true, true, true, false],
        }
      );
      rows.push(row);

      row = [];
      row.push(
        {
          text: 'Run Date',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
          border: [true, true, true, true],
        },
        {
          text: data['run_date'],
          fontSize: 10,
          border: [true, true, true, true],
        }
      );
      rows.push(row);

      let table = {
        widths: [80, '*'],
        body: rows,
      };
      return table;
    }
  }

  createSchemaaDetail(runId: any, data: any, reportType: any) {
    let row: any[] = [];
    let rows: any[] = [];

    let headerValue: string;

    if (reportType == 'performance' || reportType == 'testMigration') {
      headerValue = 'Report Date';
    } else {
      headerValue = 'Run Date';
    }
    row = [];
    row.push(
      {
        text: 'Run ID',
        color: 'white',
        fillColor: '#274584',
        fontSize: 10,
        bold: true,
        border: [true, true, true, false],
      },
      {
        text: runId,
        fontSize: 10,
        width: 90,
        border: [true, true, true, false],
      },
      {
        text: headerValue,
        color: 'white',
        fillColor: '#274584',
        fontSize: 10,
        bold: true,
        border: [true, true, true, true],
      },
      { text: data['runDate'], fontSize: 10, border: [true, true, true, true] }
    );
    rows.push(row);

    row = [];
    row.push(
      {
        text: 'Version',
        color: 'white',
        fillColor: '#274584',
        fontSize: 10,
        bold: true,
        border: [true, true, false, false],
      },
      {
        text: data['version'],
        fontSize: 10,
        border: [true, true, true, false],
        colSpan: 3,
      },
      {},
      {}
    );
    rows.push(row);

    row = [];
    row.push(
      {
        text: 'Source Database',
        color: 'white',
        fillColor: '#274584',
        fontSize: 10,
        bold: true,
        border: [true, true, false, false],
      },
      {
        text: data['sourceDatabase'],
        fontSize: 10,
        border: [true, true, true, false],
        colSpan: 3,
      },
      {},
      {}
    );
    rows.push(row);

    row = [];
    row.push(
      {
        text: 'Target Database',
        color: 'white',
        fillColor: '#274584',
        fontSize: 10,
        bold: true,
        border: [true, true, false, true],
      },
      {
        text: data['targetDatabase'],
        fontSize: 10,
        border: [true, true, true, true],
        colSpan: 3,
      },
      {},
      {}
    );

    rows.push(row);

    let table = {
      widths: [100, '*', 60, 150],
      body: rows,
    };
    return table;
  }

  getstaticDatabaseData(runId: any, reportType: any) {
    let chartData = this.getChartData(runId, reportType).schemaData;

    let _data = chartData.charts.filter(function (item: any) {
      return item.type == 'commonData';
    });

    return _data[0].chart;
  }

  getstaticAnalysisTableData(runId: any, reportType: any) {
    let chartData = this.getChartData(runId, reportType);

    let _data = chartData.charts.filter(function (item: any) {
      return item.type == 'staticAnalysis';
    });

    return _data[0].chart;
  }

  getSimpleTableData(runId: any, reportType: any, type: any) {
    let chartData = this.getChartData(runId, reportType);

    let _data = chartData.charts.filter(function (item: any) {
      return item.type == type;
    });

    return _data[0].chart;
  }

  getBatchTableData(runId: any, reportType: any, type: any) {
    return this.getTableData(runId, reportType, type);
  }

  getdiscSpaceTableData(runId: any, reportType: any, type: any) {
    return this.getTableData(runId, reportType, type);
  }

  getSpecialDatatypesTableData(runId: any, reportType: any, type: any) {
    return this.getTableData(runId, reportType, type);
  }

  getTableData(runId: any, reportType: any, type: any) {
    let chartData = this.getChartData(runId, reportType);
  
    let _data = chartData.charts.filter(function (item: any) {
      return item.type == type;
    });
  
    if (_data.length > 0) {
      return _data[0].chart;
    } else {
      return null;
    }
  }

  creatediscSpaceTableData(data: any) {
    let row: any[] = [];
    let rows: any[] = [];
    let bold: boolean;
    // row = [];

    if (data) {
      row = [
        {
          text: 'Table Name',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Column Name',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Data Type',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
      ];

      rows.push(row);

      for (let i in data) {
        row = [];
        row.push(
          {
            text: data[i]['table_name'],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: data[i]['column_name'],
            fontSize: 10,
            border: [true, true, true, true],
          },
          {
            text: data[i]['data_type'],
            fontSize: 10,
            border: [true, true, true, true],
          }
        );

        rows.push(row);
      }
      let table = {
        widths: [250, 150, '*'],
        body: rows,
      };
      return table;
    }
  }

  createSpecialDatatypesTableData(data: any) {
    let row: any[] = [];
    let rows: any[] = [];
    let bold: boolean = false;
    // row = [];

    if (data) {
      row = [
        {
          text: 'Table Name',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Column Name',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
        {
          text: 'Data Type',
          alignment: 'center',
          style: 'tableHeader',
          color: 'white',
          fillColor: '#274584',
          fontSize: 10,
          bold: true,
        },
      ];

      rows.push(row);

      for (let i in data) {
        row = [];
        row.push(
          {
            text: data[i]['table_name'],
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          },
          {
            text: data[i]['column_name'],
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          },
          {
            text: data[i]['data_type'],
            alignment: 'center',
            fontSize: 10,
            bold: bold,
            border: [true, true, true, true],
          }
        );

        rows.push(row);
      }
      let table = {
        widths: [250, 150, '*'],
        body: rows,
      };
      return table;
    }
  }

  getErrorDetail(doc: any, errors: any) {
    for (let object in errors) {
      let type = errors[object]['object_type'].replace(
        /\w\S*/g,
        (txt: any) => txt[0].toUpperCase() + txt.substr(1).toLowerCase()
      );
      if (type == 'Package Body') {
        type = 'Package Body object';
      }
      doc.content.push({
        text: type + ' Changes',
        fontSize: 11,
        color: '#274584',
        margin: [0, 15, 0, 0],
      });
      doc.content.push({
        text:
          'Please address below issues manually to complete the migration of ' +
          type +
          's.',
        fontSize: 10,
        margin: [0, 5, 0, 0],
      });

      let _errors = errors[object]['errors'];

      for (let y in _errors) {
        let marginTop = 8;
        if (y != '0') {
          marginTop = 12;
        }

        doc.content.push({
          text:
            'Issue ' +
            errors[object]['errors'][y]['error_code'] +
            ': ' +
            errors[object]['errors'][y]['error_desc'],
          fontSize: 10,
          bold: true,
          margin: [0, marginTop, 0, 2],
        });

        if (errors[object]['errors'][y]['rec_action'] != null) {
          doc.content.push({
            text:
              'Recommended Action: ' +
              errors[object]['errors'][y]['rec_action'],
            fontSize: 10,
            margin: [0, 2, 0, 0],
          });
        }

        if (errors[object]['errors'][y]['doc_reference'] != null) {
          doc.content.push({
            text:
              'Documentation Reference: ' +
              errors[object]['errors'][y]['doc_reference'],
            fontSize: 10,
            margin: [0, 2, 0, 0],
          });
        }

        if (errors[object]['errors'][y]['total_occurrence'] != null) {
          let _text =
            'Number of Occurrences: ' +
            errors[object]['errors'][y]['total_occurrence'];
          if (errors[object]['errors'][y]['complexity'] != null) {
            _text =
              _text +
              ' | ' +
              'Estimated Complexity: ' +
              errors[object]['errors'][y]['complexity'];
          }
          doc.content.push({
            text: _text,
            fontSize: 10,
            margin: [0, 2, 0, 0],
          });
        }

        if (errors[object]['errors'][y]['object_names'] != null) {
          let objectNames = errors[object]['errors'][y]['object_names'].replace(
            /,/g,
            ', '
          );

          doc.content.push({
            text: objectNames,
            fontSize: 10,
            margin: [0, 2, 0, 0],
          });
        }
      }
    }
  }

  downloadNewAssessmentReport(runId: any, reportType: any) {
    let spinner = this.spinner;
    let codeObjectText: any;
    let storageObjectText: any;
    let schemaIntroText: any;
    let summaryText: any;
    let objectsCountText: any;

    spinner.show();

    let commonData = this.getSchemaDetail(runId, reportType);

    let errorData = commonData.errorData;

    let storageObjectsErrorData = errorData['Storage Objects'];
    let getErrorDetail = this.getErrorDetail;

    let codeObjectsErrorData = errorData['Code Objects'];

    let schemaDataTable = this.createSchemaaDetail(
      runId,
      commonData,
      reportType
    );

    let charPromise: any[] = this.getCharPromises(runId, reportType);

    let dependencyTableData = this.getSimpleTableData(
      runId,
      reportType,
      'dependency'
    );
    let dependencyData = this.createSimpleTable(dependencyTableData);

    let analysisTableData = this.getstaticAnalysisTableData(runId, reportType);
    let analysisData = this.createAnalysisTable(analysisTableData, reportType);

    let discSpaceTableData = this.getdiscSpaceTableData(
      runId,
      reportType,
      'discSpace'
    );
    let discSpaceData = this.creatediscSpaceTableData(discSpaceTableData);

    let specialDatatypesTableData = this.getSpecialDatatypesTableData(
      runId,
      reportType,
      'specialDatatypes'
    );
    let specialDatatypesData = this.createSpecialDatatypesTableData(
      specialDatatypesTableData
    );

    let objectCount =
      commonData['analyticData']['Grand Total'][0].simpleObjects +
      commonData['analyticData']['Grand Total'][0].mediumObjects +
      commonData['analyticData']['Grand Total'][0].difficultObjects +
      commonData['analyticData']['Grand Total'][0].complexObjects;

    if (commonData['codeObjectConversion'] == '100%') {
      codeObjectText =
        commonData['codeObjectConversion'] +
        ' of Code Objects are fully converted and none require manual remediation';
    } else if (commonData['codeObjectManual'] == '100%') {
      codeObjectText =
        'No Code Objects got converted and ' +
        commonData['codeObjectManual'] +
        ' Code Objects require manual remediation';
    } else if (
      commonData['codeObjectManual'] == '%' &&
      commonData['codeObjectConversion'] == '%'
    ) {
      codeObjectText = 'No Code Objects found in database';
    } else {
      codeObjectText =
        commonData['codeObjectConversion'] +
        ' of Code Objects are fully converted and remaining ' +
        commonData['codeObjectManual'] +
        ' require manual remediation';
    }

    if (commonData['storageObjectConversion'] == '100%') {
      storageObjectText =
        commonData['storageObjectConversion'] +
        ' of Storage Objects are fully converted and none require manual remediation';
    } else if (commonData['storageObjectManual'] == '100%') {
      storageObjectText =
        'No Storage Objects got converted and ' +
        commonData['storageObjectManual'] +
        ' Storage Objects require manual remediation';
    } else if (
      commonData['storageObjectManual'] == '%'
    ) {
      storageObjectText = 'No Storage Objects found in database';
    } else {
      storageObjectText =
        commonData['storageObjectConversion'] +
        ' of database Storage Objects are fully converted and ' +
        commonData['storageObjectManual'] +
        ' require manual remediation';
    }

    if (
      commonData['totalConversion'] == '100%' &&
      commonData['manualConversion'] == '0%'
    ) {
      schemaIntroText =
        'DMAP analyzed ' +
        commonData['totalObject'] +
        ' database objects of which ' +
        commonData['totalConversion'] +
        ' of objects can be fully converted using DMAP and none require manual remediation to migrate them to ' +
        commonData['targetDBType'] +
        ' database.';
      summaryText =
        'Assessment of your ' +
        commonData['sourceDBType'] +
        ' schema estimates that ' +
        commonData['totalConversion'] +
        ' of database objects can be converted automatically to ' +
        commonData['targetDBType'] +
        '.';
    } else if (
      commonData['manualConversion'] == '100%' &&
      commonData['totalConversion'] == '0%'
    ) {
      schemaIntroText =
        'DMAP analyzed ' +
        commonData['totalObject'] +
        ' database objects. None of them can be fully converted using DMAP and all objects require manual remediation to migrate them to ' +
        commonData['targetDBType'] +
        ' database.';
      summaryText =
        'Assessment of your ' +
        commonData['sourceDBType'] +
        ' schema estimates that none of database objects can be converted fully to ' +
        commonData['targetDBType'] +
        ' and all objects require manual remediation.';
    } else {
      schemaIntroText =
        'DMAP analyzed ' +
        commonData['totalObject'] +
        ' database objects of which ' +
        commonData['totalConversion'] +
        ' of objects can be fully converted using DMAP and remaining ' +
        commonData['manualConversion'] +
        ' require manual remediation to migrate them to ' +
        commonData['targetDBType'] +
        ' database.';
      summaryText =
        'Assessment of your ' +
        commonData['sourceDBType'] +
        ' schema estimates that ' +
        commonData['totalConversion'] +
        ' of database objects can be converted automatically to ' +
        commonData['targetDBType'] +
        ' and remaining ' +
        commonData['manualConversion'] +
        ' require manual remediation.';
    }
    if (commonData['totalStorageObject'] == commonData['totalObject']) {
      objectsCountText =
        'Of ' +
        commonData['totalObject'] +
        ' objects, all ' +
        commonData['totalStorageObject'] +
        ' are Storage Objects ';
    } else if (commonData['totalCodeObject'] == commonData['totalObject']) {
      objectsCountText =
        'Of ' +
        commonData['totalObject'] +
        ' objects, all ' +
        commonData['totalCodeObject'] +
        ' are Code Objects ';
    } else {
      objectsCountText =
        'Of ' +
        commonData['totalObject'] +
        ' objects, ' +
        commonData['totalStorageObject'] +
        ' are Storage Objects and remaining ' +
        commonData['totalCodeObject'] +
        ' are Code Objects';
    }
    let objects_text = [];
    let final_text: string = '';
    if (
      commonData['simpleObjectPercentage'] != '0%' &&
      commonData['simpleObjectPercentage'] != '%'
    ) {
      objects_text.push(commonData['simpleObjectPercentage'] + ' are simple');
    }
    if (
      commonData['mediumObjectPercentage'] != '0%' &&
      commonData['mediumObjectPercentage'] != '%'
    ) {
      objects_text.push(commonData['mediumObjectPercentage'] + ' are medium');
    }
    if (
      commonData['complexObjectPercentage'] != '0%' &&
      commonData['complexObjectPercentage'] != '%'
    ) {
      objects_text.push(commonData['complexObjectPercentage'] + ' are complex');
    }
    if (
      commonData['veryComplexObjectPercentage'] != '0%' &&
      commonData['veryComplexObjectPercentage'] != '%'
    ) {
      objects_text.push(
        commonData['veryComplexObjectPercentage'] + ' are very complex'
      );
    }

    if (
      commonData['simpleObjectPercentage'] != '0%' ||
      commonData['simpleObjectPercentage'] != '%' ||
      commonData['mediumObjectPercentage'] != '0%' ||
      commonData['mediumObjectPercentage'] != '%' ||
      commonData['complexObjectPercentage'] != '0%' ||
      commonData['complexObjectPercentage'] != '%' ||
      commonData['veryComplexObjectPercentage'] != '0%' ||
      commonData['veryComplexObjectPercentage'] != '%'
    ) {
      for (let i in objects_text) {
        if (
          Number(objects_text.length) > 1 &&
          Number(i) + 1 == Number(objects_text.length)
        ) {
          final_text = final_text.slice(0, -1) + ' and ';
        }
        final_text += objects_text[i];
        if (Number(i) + 1 != Number(objects_text.length)) {
          final_text += ', ';
        }
      }
    }

    Promise.all(charPromise).then(function (res) {
      let pdfMake = res[0];
      const content: any[] = [];

      let doc = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [30, 45, 30, 30],
        header: function () {
          return [
            {
              image: environment.NEWTGLOBAL_ICON,
              alignment: 'right',
              width: 100,
              margin: [5, 2, 15, 20],
            },
          ];
        },
        footer: function (currentPage: any, pageCount: any) {
          return [
            {
              text: 'Page ' + currentPage.toString() + ' | ' + pageCount,
              color: '#A9A9A9',
              alignment: 'right',
              margin: [35, 0],
            },
          ];
        },
        content: content,
      };

      doc.content.push({
        text: commonData.sourceSchema + ' Schema Assessment Report',
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5],
      });

      doc.content.push({
        table: schemaDataTable,
        width: 530,
        margin: [0, 10, 0, 20],
      });

      doc.content.push({
        text: 'Assessment Summary',
        fontSize: 12,
        bold: true,
        color: '#274584',
        margin: [0, 10, 0, 5],
      });

      doc.content.push({
        text: summaryText,
        fontSize: 10,
        margin: [0, 7, 0, 5],
      });

      doc.content.push({
        text:
          'An Order of Magnitude to migrate to ' +
          commonData['targetDBType'] +
          ' using DMAP is ' +
          commonData['manualConversionEffort'] +
          ' man hours.',
        fontSize: 10,
        margin: [0, 7, 0, 5],
      });

      doc.content.push({
        text: 'With DMAP you save with economies of scale. Our migration experts can work closely with you to further review if addition database constructs unique to your business case can be automated to further increase your savings.',
        fontSize: 10,
        margin: [0, 7, 0, 5],
      });

      doc.content.push({
        text: commonData.sourceSchema + ' Schema Analysis',
        fontSize: 12,
        bold: true,
        color: '#274584',
        margin: [0, 10, 0, 5],
      });

      doc.content.push({
        text:
          schemaIntroText +
          ' Database storage objects considered for assessment include database links, tables, partitions, indexes, types, sequences etc. Code objects that were analyzed include procedures, functions, triggers, packages, views, synonyms etc.',
        fontSize: 10,
        margin: [0, 7, 0, 5],
      });

      if (final_text.length > 0) {
        doc.content.push({
          ul: [
            objectsCountText,
            'DMAP analyzed complexity of tables, procedures, functions and triggers including those present in Packages; of these  ' +
              objectCount +
              ' objects, ' +
              final_text,
            storageObjectText,
            codeObjectText,
          ],
          fontSize: 10,
          margin: [0, 7, 0, 5],
        });
      } else {
        doc.content.push({
          ul: [objectsCountText, storageObjectText, codeObjectText],
          fontSize: 10,
          margin: [0, 7, 0, 5],
        });
      }

      doc.content.push({
        text: 'Dependencies',
        fontSize: 11,
        color: '#274584',
        margin: [0, 10, 0, 5],
      });

      if (dependencyTableData.length > 0) {
        doc.content.push({
          text:
            commonData.sourceSchema +
            ' schema has dependency on below references objects. We recommend to resolve those dependencies first and then proceed with conversion of ' +
            commonData.sourceSchema +
            ' schema to get better conversion statistics for Storage and Code objects.',
          fontSize: 10,
          margin: [0, 10, 0, 0],
        });
        doc.content.push({
          table: dependencyData,
          width: 530,
          margin: [0, 10, 0, 20],
        });
      } else {
        doc.content.push({
          text: commonData.sourceSchema + ' schema has no dependency.',
          fontSize: 10,
          margin: [0, 10, 0, 20],
        });
      }

      doc.content.push({
        text: 'Static Analysis of Database Objects',
        fontSize: 11,
        color: '#274584',
        margin: [0, 10, 0, 5],
      });

      doc.content.push({
        table: analysisData,
        width: 530,
        margin: [0, 10, 0, 20],
        //pageBreak:'after'
      });

      if (discSpaceTableData.length > 0) {
        doc.content.push({
          text: 'Large Object Details',
          fontSize: 11,
          color: '#274584',
          margin: [0, 10, 0, 5],
        });

        doc.content.push({
          table: discSpaceData,
          width: 530,
          margin: [0, 10, 0, 20],
        });
      }

      if (specialDatatypesTableData.length > 0) {
        doc.content.push({
          text: 'Special Datatypes',
          fontSize: 11,
          color: '#274584',
          margin: [0, 10, 0, 5],
        });

        doc.content.push({
          table: specialDatatypesData,
          width: 530,
          margin: [0, 10, 0, 20],
        });
      }

      if (
        commonData.codeObjects.length > 0 &&
        commonData.storageObjects.length > 0
      ) {
        doc.content.push({
          text: 'Conversion Statistics of Storage Objects',
          fontSize: 11,
          color: '#274584',
          margin: [0, 10, 0, 0],
        });

        doc.content.push({
          image: res[2],
          width: 530,
          margin: [0, 10, 30, 15],
        });

        doc.content.push({
          text: 'Conversion Statistics of Code Objects',
          fontSize: 11,
          color: '#274584',
          margin: [0, 5, 0, 0],
        });

        doc.content.push({
          image: res[3],
          width: 530,
          margin: [0, 10, 0, 15],
        });
      } else {
        if (commonData.codeObjects.length > 0) {
          doc.content.push({
            text: 'Conversion Statistics of Storage Objects',
            fontSize: 11,
            color: '#274584',
            margin: [0, 10, 0, 0],
          });

          doc.content.push({
            text: 'No Storage Objects found in database',
            fontSize: 10,
            margin: [0, 10, 0, 0],
          });

          doc.content.push({
            text: 'Conversion Statistics of Code Objects',
            fontSize: 11,
            color: '#274584',
            margin: [0, 10, 0, 0],
          });

          doc.content.push({
            image: res[2],
            width: 530,
            margin: [0, 10, 30, 15],
          });
        } else {
          doc.content.push({
            text: 'Conversion Statistics of Storage Objects',
            fontSize: 11,
            color: '#274584',
            margin: [0, 10, 0, 0],
          });

          doc.content.push({
            image: res[2],
            width: 530,
            margin: [0, 10, 30, 15],
          });
          doc.content.push({
            text: 'Conversion Statistics of Code Objects',
            fontSize: 11,
            color: '#274584',
            margin: [0, 10, 0, 0],
          });

          doc.content.push({
            text: 'No Code Objects found in database',
            fontSize: 10,
            margin: [0, 10, 0, 0],
          });
        }
      }

      doc.content.push({
        text: 'Conversion Effort',
        fontSize: 12,
        bold: true,
        color: '#274584',
        margin: [0, 10, 0, 5],
      });

      doc.content.push({
        text:
          'DMAP will help you accelerate the database schema conversion process from ' +
          commonData['sourceDBType'] +
          ' to ' +
          commonData['targetDBType'] +
          ' through progressive automation of stored procedures, functions, SQL queries, business logic and custom schema constructs. After running DMAP automated conversion, an effort of ' +
          commonData['manualConversionEffort'] +
          ' hrs will be required to complete the migration to ' +
          commonData['targetDBType'] +
          '. Phase-wise breakup of effort is shown below.',
        fontSize: 10,
        margin: [0, 7, 0, 5],
      });

      doc.content.push({
        text: 'DMAP Conversion Order of Magnitude (hrs)',
        fontSize: 11,
        color: '#274584',
        margin: [0, 10, 0, 0],
      });

      doc.content.push({
        image: res[1],
        width: 530,
        margin: [0, 10, 0, 30],
      });

      // doc.content.push({
      //   text: "Assumptions:",
      //   fontSize: 10,
      //   bold: true,
      //   margin: [0, 7, 0, 0]
      // });

      doc.content.push({
        text: 'Database Schema Conversion plan provides an indicative effort to migrate Oracle database schema to PostgreSQL schema in a non-prod environment. Effort is calculated assuming proficiency in Oracle and PostgreSQL, and may vary based on individual productivity. Following assumptions are taken to estimate the conversion effort:',
        fontSize: 10,
        margin: [0, 0, 0, 0],
      });

      doc.content.push({
        ul: [
          'Conversion of Oracle PL/SQL constructs which are not compatible with PostgreSQL may require additional assessment.',
          'Functions and procedures are validated, if provided with valid input parameter values, by comparing the output and execution time for target database against the output and execution time for source database.  Single threaded procedure / function round trip time is used as execution time for comparing performance. Performance parity (+/- 20%) between source and target database schemas is ensured.',
        ],
        fontSize: 10,
        margin: [0, 7, 0, 5],
      });

      // doc.content.push({
      //   text: "The Assessment of the db schema is based on the sql syntax of the source database. The object conversion is depends upon the reference schema and objects, so there will be some possibility of difference in object conversion",
      //   fontSize: 10,
      //   margin: [0, 0, 0, 5]
      // });

      if (
        storageObjectsErrorData.length > 0 ||
        codeObjectsErrorData.length > 0
      ) {
        doc.content.push({
          text:
            'Recommendations for Migration to ' + commonData['targetDBType'],
          fontSize: 12,
          bold: true,
          color: '#274584',
          margin: [0, 10, 0, 0],
        });

        if (storageObjectsErrorData.length > 0) {
          doc.content.push({
            text: 'Storage Object Actions',
            fontSize: 11,
            bold: true,
            color: '#274584',
            margin: [0, 10, 0, 0],
          });

          getErrorDetail(doc, storageObjectsErrorData);

          // for(let object in storageObjectsErrorData){
          //   let type = storageObjectsErrorData[object]["object_type"].replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
          //   doc.content.push({
          //     text:  type+" Changes",
          //     fontSize: 11,
          //     color:'#274584',
          //     margin: [0, 15, 0, 3]
          //   });
          //   doc.content.push({
          //     text:  "Please address below issues manually to complete the migration of "+type+"s",
          //     fontSize: 10,
          //     margin: [0, 5, 0, 0]
          //   });
          //   for(let error in storageObjectsErrorData[object]["errors"]){
          //   let object_names = [];
          //   object_names = storageObjectsErrorData[object]["errors"][error]["object_names"].split(',')
          //   doc.content.push({
          //     text:  "Issue "+storageObjectsErrorData[object]["errors"][error]["error_code"]+": "+storageObjectsErrorData[object]["errors"][error]["error_desc"] ,
          //     fontSize: 10,
          //     bold: true,
          //     margin: [0, 8, 0, 0]
          //   });
          //   doc.content.push({
          //     text:  "Number of occurrences: "+ storageObjectsErrorData[object]["errors"][error]["total_occurrence"],
          //     fontSize: 10,
          //     margin: [0, 5, 0, 4]
          //   });
          //   for(let i in object_names){
          //     doc.content.push({
          //       text:  object_names[i],
          //       fontSize: 10,
          //       margin: [0, 5, 0, 0]
          //     });
          //     }
          //   }
          // }
        }
        if (codeObjectsErrorData.length > 0) {
          doc.content.push({
            text: 'Code Object Actions',
            fontSize: 11,
            bold: true,
            color: '#274584',
            margin: [0, 15, 0, 0],
          });

          getErrorDetail(doc, codeObjectsErrorData);
          // for(let object in codeObjectsErrorData){

          //   let type = codeObjectsErrorData[object]["object_type"].replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))

          //   doc.content.push({
          //     text:  type+" Changes",
          //     fontSize: 11,
          //     color:'#274584',
          //     margin: [0, 15, 0, 3]
          //   });
          //   doc.content.push({
          //     text:  "Please address below issues manually to complete the migration of "+type+"s",
          //     fontSize: 10,
          //     margin: [0, 5, 0, 0]
          //   });
          //   for(let error in codeObjectsErrorData[object]["errors"]){
          //   let object_names = [];
          //   object_names = codeObjectsErrorData[object]["errors"][error]["object_names"].split(',')
          //   doc.content.push({
          //     text:  "Issue "+codeObjectsErrorData[object]["errors"][error]["error_code"]+": "+codeObjectsErrorData[object]["errors"][error]["error_desc"] ,
          //     fontSize: 10,
          //     bold: true,
          //     margin: [0, 8, 0, 0]
          //   });
          //   doc.content.push({
          //     text:  "Number of occurrences: "+ codeObjectsErrorData[object]["errors"][error]["total_occurrence"],
          //     fontSize: 10,
          //     margin: [0, 5, 0, 4]
          //   });
          //   for(let i in object_names){
          //     doc.content.push({
          //       text:  object_names[i],
          //       fontSize: 10,
          //       margin: [0, 5, 0, 0]
          //     });
          //     }
          //   }
          //   }
        }
      }

      pdfMake
        .createPdf(doc)
        .download(
          commonData.sourceDBName +
            '_' +
            commonData.sourceSchema +
            '_' +
            runId +
            '_assessmentReport.pdf'
        );
      spinner.hide();
    });
  }
}
