import React, { Component } from 'react';
import moment from 'moment';

import OvertimeStore from '../stores/OvertimeStore';
import OvertimeActions from '../actions/OvertimeActions';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Link } from 'react-router-dom';

import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

class OvertimeOverview extends Component {

  constructor() {
    super();

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var startDate = moment(new Date(y,m,1));
    var endDate = moment(new Date(y,m+1,0));

    this.state = {
      overtimeEntries: OvertimeStore.getOvertimes(startDate, endDate),
      startDateFilter: startDate,
      endDateFilter: endDate,
      focusedInputFilter: null
    };

    // We need to bind this to onChange so we can have
    // the proper this reference inside the method
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    OvertimeStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    if(!OvertimeStore.hasLoaded()) {
        OvertimeActions.loadOvertimes();
    }
  }

  componentWillUnmount() {
    OvertimeStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      overtimeEntries: OvertimeStore.getOvertimes(this.state.startDateFilter, this.state.endDateFilter)
    });
  }

  dateFilterChange(filterValue) {
    this.setState({
      overtimeEntries: OvertimeStore.getOvertimes(filterValue.startDate, filterValue.endDate),
      startDateFilter: filterValue.startDate,
      endDateFilter: filterValue.endDate
    });
  }

  deleteOvertime(id) {
    if (window.confirm('Are you sure you want to delete?')) {
      OvertimeActions.deleteOvertime(id);
    }
  }

  strToArrBuffer(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  //TODO: also used in overtimeDetails. Extract it in an utils function.
  timeStringToMinutes(str) {
    const time = str.split(':');
    return parseInt(time[0])*60 + parseInt(time[1]);
  }

  dateStringToXlsDate(str) {
    if(str) {
      const date = str.split('-');
      return "DATE(" + date[0] + "," + parseInt(date[1]) + "," + date[2] + ")";
    }
    return null;
  }

  exportXlsx() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/template.xlsx', true);
    xhr.responseType = 'arraybuffer';
    var strToArrBuffer = this.strToArrBuffer;
    var timeStringToMinutes = this.timeStringToMinutes;
    var dateStringToXlsDate = this.dateStringToXlsDate;
    const thisOvertimes = this.state.overtimeEntries;
    xhr.onload = function (oEvent) {
      var arrayBuffer = xhr.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        var byteStr = "";
        for (var i = 0; i < byteArray.byteLength; i++) {
          byteStr += String.fromCharCode(byteArray[i]);
        }
        const wb = XLSX.read(byteStr, {type:'binary'});
        const ws = wb.Sheets[wb.SheetNames[0]];
        ws["C3"].v="Cristian Sorin Ciora";
        ws["C4"].z="M/D/YYYY";
        ws["A28"].v="Cristian Sorin Ciora";
        ws["D28"].v="Alexandar Nestorovici";
        ws["G28"].v="Marius Pentek";
        var rowIdx = 8;
        for(var i=0; i<thisOvertimes.length; i++){
          var o = thisOvertimes[i];
          ws["A"+rowIdx] = {
            t: "n",
            f: dateStringToXlsDate(o.date),
            z: "M/D/YYYY"
          };
          ws["C"+rowIdx] = {
            t: "n",
            v: timeStringToMinutes(o.startTime)/1440,
            z: "H:MM;@"
          };
          ws["D"+rowIdx] = {
            t: "n",
            v: timeStringToMinutes(o.endTime)/1440,
            z: "H:MM;@"
          };
          ws["E"+rowIdx] = {
            t: "n",
            f: "D"+rowIdx+"-C"+rowIdx,
            z: "H:MM;@"
          };
          var freeTimeOnFormula = dateStringToXlsDate(o.freeTimeOn);
          if(freeTimeOnFormula) {
            ws["F"+rowIdx] = {
              t: "n",
              f: freeTimeOnFormula,
              z: "M/D/YYYY"
            };
          }
          ws["G"+rowIdx] = {
            t: "s",
            v: o.comment
          };
          rowIdx++;
        }
        ws["E25"] = {
          t: "n",
          f: "SUM(E8:E21)",
          z: "H:MM;@"
        };

        const wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'binary'});
        saveAs(new Blob([strToArrBuffer(wbout)], {type: "application/octet-stream"}), "result.xlsx");
      }
    };
    xhr.send();
  }

  render() {
    const columns = [{
      Header: 'Date',
      accessor: 'date'
    }, {
      Header: 'Start Time',
      accessor: 'startTime'
    }, {
      Header: 'End Time',
      accessor: 'endTime'
    }, {
      Header: 'Free time',
      accessor: 'freeTimeOn'
    }, {
      Header: 'Comment',
      accessor: 'comment'
    }, {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({value}) => (<span>
                            <Link to={`/overtime/${value}`}><span className="overtimeEdit">&nbsp;</span></Link>
                            <span className="overtimeDelete" onClick={() => this.deleteOvertime(value)}>&nbsp;</span>
                          </span>
                        ),
      style: {'textAlign':'center'}
    }];

    return (
        <div>
          <div>
            <DateRangePicker
              startDate={this.state.startDateFilter}
              endDate={this.state.endDateFilter}
              onDatesChange={({ startDate, endDate }) => this.dateFilterChange({ startDate, endDate })}
              focusedInput={this.state.focusedInputFilter}
              onFocusChange={focusedInput => this.setState({ focusedInputFilter:focusedInput })}
              startDateId="startDateFilterId" endDateId="endDateFilterId"
              firstDayOfWeek={1} displayFormat="YYYY-MM-DD"
              isOutsideRange={() => false}/>
          <div style={{'float':'right'}}>
            <button onClick={() => this.exportXlsx()}>Export XLSX</button>
            <button><Link to={"/overtime/new"} className="simpleLink">New Overtime</Link></button>
          </div>
          </div>

          <ReactTable defaultPageSize={10}
            data={this.state.overtimeEntries}
            columns={columns}
          />
        </div>
    );
  }
}

export default OvertimeOverview;
