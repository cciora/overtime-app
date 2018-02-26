import React, { Component } from 'react';
import moment from 'moment';
import OvertimeListHeader from './OvertimeListHeader';
import OvertimeListItem from './OvertimeListItem';

import OvertimeStore from '../stores/OvertimeStore';
import OvertimeActions from '../actions/OvertimeActions';

class OvertimeOverview extends Component {

  constructor() {
    super();

    this.state = {
      overtimeEntries: [],
      month: new Date().getMonth()+1,
      year: new Date().getFullYear()
    };

    // We need to bind this to onChange so we can have
    // the proper this reference inside the method
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    OvertimeStore.addChangeListener(this.onChange);
    OvertimeStore.addDeleteChangeListener(this.onDelete)
  }

  componentDidMount() {
    OvertimeActions.recieveOvertimes();
  }

  componentWillUnmount() {
    OvertimeStore.removeChangeListener(this.onChange);
    OvertimeStore.removeDeleteChangeListener(this.onDelete);
  }

  onChange() {
    this.setState({
      overtimeEntries: OvertimeStore.getOvertimes()
    });
  }

  onDelete(payload) {
    OvertimeActions.recieveOvertimes();
  }

  render() {
    let entries = [];
    for (let i=0; i< this.state.overtimeEntries.length; i++) {
      const entry = this.state.overtimeEntries[i];
      const d = moment(entry.date,'DD.MM.YYYY');
      if(d.month()+1 === this.state.month && d.year() === this.state.year) {
        entries.push(entry);
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
        <table className="overtime">
          <tbody>
            <OvertimeListHeader />
            {rows}
          </tbody>
        </table>
    );
  }
}

export default OvertimeOverview;
