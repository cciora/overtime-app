import React, { Component } from 'react';
import moment from 'moment';
import OvertimeListHeader from './OvertimeListHeader';
import OvertimeListItem from './OvertimeListItem';

import OvertimeStore from '../stores/OvertimeStore';
import OvertimeActions from '../actions/OvertimeActions';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';

class OvertimeOverview extends Component {

  constructor() {
    super();

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    this.state = {
      overtimeEntries: OvertimeStore.getOvertimes(),
      startDateFilter: moment(new Date(y,m,1)),
      endDateFilter: moment(new Date(y,m+1,0)),
      focusedInputFilter: null
    };

    // We need to bind this to onChange so we can have
    // the proper this reference inside the method
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    OvertimeStore.addChangeListener(this.onChange);
    // OvertimeStore.addDeleteChangeListener(this.onDelete)
  }

  componentDidMount() {
    if(!OvertimeStore.hasLoaded()) {
        OvertimeActions.loadOvertimes();
    }
  }

  componentWillUnmount() {
    OvertimeStore.removeChangeListener(this.onChange);
    // OvertimeStore.removeDeleteChangeListener(this.onDelete);
  }

  onChange() {
    this.setState({
      overtimeEntries: OvertimeStore.getOvertimes()
    });
  }

  dateFilterChange(filterValue) {
    this.setState({
      startDateFilter: filterValue.startDate,
      endDateFilter: filterValue.endDate
    });
  }

  // onDelete(payload) {
  //   if (payload.errors && payload.errors.length > 0) {
  //     alert(payload.errors[0].message)
  //   } else {
  //     OvertimeActions.recieveOvertimes();
  //   }
  // }

  render() {
    let entries = [];
    if(this.state.overtimeEntries) {
      for (let i=0; i< this.state.overtimeEntries.length; i++) {
        const entry = this.state.overtimeEntries[i];
        // const d = moment(entry.date,'DD.MM.YYYY');
        // if(d.month()+1 === this.state.month && d.year() === this.state.year) {
          entries.push(entry);
        // }
      }
    }
    let rows;
    if(entries.length > 0) {
      rows = entries.map((entry) => {
        return (
          <OvertimeListItem key={entry.id} overtime={entry} />
        );
      });
    } else {
      rows = <tr><td colSpan="6">No data to display!</td></tr>;
    }
    return (
        <div>
          <DateRangePicker
            startDate={this.state.startDateFilter}
            endDate={this.state.endDateFilter}
            onDatesChange={({ startDate, endDate }) => this.dateFilterChange({ startDate, endDate })}
            focusedInput={this.state.focusedInputFilter}
            onFocusChange={focusedInput => this.setState({ focusedInputFilter:focusedInput })}
            firstDayOfWeek={1} displayFormat="YYYY-MM-DD"
            isOutsideRange={() => false}/>
          <table className="overtime">
            <tbody>
              <OvertimeListHeader />
              {rows}
            </tbody>
          </table>
        </div>
    );
  }
}

export default OvertimeOverview;
