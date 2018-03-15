import React, { Component } from 'react';
import moment from 'moment';

import OvertimeStore from '../stores/OvertimeStore';
import OvertimeActions from '../actions/OvertimeActions';
import ExcelExport from './ExcelExport';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Link } from 'react-router-dom';

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
            <ExcelExport overtimes={this.state.overtimeEntries} />
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
