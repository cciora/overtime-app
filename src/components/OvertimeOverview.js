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

import * as XLSX from 'xlsx-style';
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
      // return date[1] + "/" + date[2] + "/" + date[0];
    }
    return null;
  }

  exportXlsx() {
    var strToArrBuffer = this.strToArrBuffer;
    var timeStringToMinutes = this.timeStringToMinutes;
    var dateStringToXlsDate = this.dateStringToXlsDate;
    const thisOvertimes = this.state.overtimeEntries;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/template.xlsx', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (oEvent) {
      var data = new Uint8Array(xhr.response);
      const wb = XLSX.read(data, {type:'array', cellStyles: true, cellFormula: true});
      const ws = wb.Sheets[wb.SheetNames[0]];

      // var wscols = [
      //     {wpx:120},
      //     {wpx:60},
      //     {wpx:60},
      //     {wpx:60},
      //     {wpx:80},
      //     {wpx:80},
      //     {wpx:200}
      // ];
      // ws['!cols'] = wscols;
      //ws['!rows'] = [{hpx:30},,,,,,{hpx:28},,,,,,,,,,,,,,,,{hidden:true},{hidden:true},,,];

      ws["C3"].v="Cristian Sorin Ciora";
      ws["C4"].z="M/D/YYYY";
      ws["A28"].v="Cristian Sorin Ciora";
      ws["D28"].v="Alexandar Nestorovici";
      ws["G28"].v="Marius Pentek";

      ws["A1"].s.alignment = {horizontal:"center"};
      ws["C3"].s.alignment = {horizontal:"center"};
      ws["C4"].s.alignment = {horizontal:"center"};
      ws["C5"].s.alignment = {horizontal:"center"};

      var rowIdx = 8;
      for(var i=0; i<thisOvertimes.length; i++){
        var o = thisOvertimes[i];
        var startValue = timeStringToMinutes(o.startTime)/1440;
        var endValue = timeStringToMinutes(o.endTime)/1440;
        ws["A"+rowIdx].f = dateStringToXlsDate(o.date);
        delete ws["A"+rowIdx].w;
        ws["C"+rowIdx].v = startValue;
        ws["D"+rowIdx].v = endValue;

        ws["E"+rowIdx].v = (endValue-startValue);
        ws["E"+rowIdx].t = "n";
        ws["E"+rowIdx].z = "H:MM;@";

        var freeTimeOnFormula = dateStringToXlsDate(o.freeTimeOn);
        if(freeTimeOnFormula) {
          ws["F"+rowIdx].v = freeTimeOnFormula;
        }
        ws["G"+rowIdx].v = o.comment;
        ws["G"+rowIdx].t = "s";
        rowIdx++;
      }
      console.log(ws);
      // ws["E25"] = {
      //   t: "n",
      //   f: "SUM(E8:E21)",
      //   z: "H:MM;@"
      // };

      const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary', cellStyles: true, cellFormula: true});
      saveAs(new Blob([strToArrBuffer(wbout)], {type: "application/octet-stream"}), "result.xlsx");
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
