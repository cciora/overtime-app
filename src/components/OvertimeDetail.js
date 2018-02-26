import React from 'react';
import { Link } from 'react-router-dom';
import OvertimeAction from '../actions/OvertimeActions';
import OvertimeStore from '../stores/OvertimeStore';
//import Modal from 'react-modal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeInput from 'time-input';

class OvertimeDetail extends React.Component {
  constructor () {
    super();

    this.state = {
      overtime: {},
      validationMessage: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onValidation = this.onValidation.bind(this);
    this.handleOvertimeDateChange = this.handleOvertimeDateChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleFreeTimeOnDateChange = this.handleFreeTimeOnDateChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
  }

  componentWillMount() {
    OvertimeStore.addChangeListener(this.onChange);
    OvertimeStore.addSaveChangeListener(this.onValidation);
  }

  componentDidMount() {
      OvertimeAction.getOvertime(this.props.match.params.id);
  }

  componentWillUnmount() {
    OvertimeStore.removeChangeListener(this.onChange);
    OvertimeStore.removeSaveChangeListener(this.onValidation);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      overtime: OvertimeAction.getOvertime(nextProps.match.params.id)
    });
  }

  onChange() {
    this.setState({
      overtime: OvertimeStore.getOvertime(this.props.match.params.id)
    });
  }

  onValidation(payload) {
    //if (payload.isValid) {
      this.props.history.push('/');
    //} else {
    //  this.setState({validationMessage: payload.message});
    //}
  }

  handleOvertimeDateChange(date) {
    let temp = Object.assign({}, this.state.overtime);
    temp.date = date ? date.format('DD.MM.YYYY') : null;
    this.setState({overtime: temp});
  }

  handleStartTimeChange(val) {
    let temp = Object.assign({}, this.state.overtime);
    temp.startTime = val;
    this.setState({overtime: temp});
  }

  handleEndTimeChange(val) {
    let temp = Object.assign({}, this.state.overtime);
    temp.endTime = val;
    this.setState({overtime: temp});
  }

  handleFreeTimeOnDateChange(date) {
    let temp = Object.assign({}, this.state.overtime);
    temp.freeTimeOn = date ? date.format('DD.MM.YYYY') : null;
    this.setState({overtime: temp});
  }

  handleCommentChange(event) {
    let temp = Object.assign({}, this.state.overtime);
    temp.comment = event.target.value;
    this.setState({overtime: temp});
  }

  saveHandler() {
    // the date is mandatory
    // if(!moment(this.state.overtime.date, 'DD.MM.YYYY').isValid()) {
    //   this.setState({validationMessage: 'Please specify a valid date!'});
    //   return;
    // }
    // if(!this.state.overtime.startTime){
    //   this.setState({validationMessage: 'Start Time is mandatory!'});
    //   return;
    // }
    // if(!this.state.overtime.endTime){
    //   this.setState({validationMessage: 'End Time is mandatory!'});
    //   return;
    // }
    this.setState({validationMessage: ''});

    OvertimeAction.saveOvertime(this.state.overtime);
  }

  isWeekday (d) {
    return d.day() > 0 && d.day() < 6;
  }

  render() {
    let overtime;
    if (this.state.overtime) {
      overtime = this.state.overtime;
    }
    return (
      <div>
      { this.state.overtime &&
      <div className="editFormWrapper">
        <div className="editForm">
          <div className="formRow">
            <span>Date:</span>
            <DatePicker selected={overtime.date ? moment(overtime.date,'DD.MM.YYYY') : ''}
              onChange={this.handleOvertimeDateChange}
              className="overtimeDatePicker" dateFormat="DD.MM.YYYY" placeholderText="Date" required="true"
              minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
              filterDate={(this.isWeekday)} />
          </div>
          <div className="formRow">
            <span>Start Time:</span>
            <TimeInput value={overtime.startTime} onChange={this.handleStartTimeChange} />
          </div>
          <div className="formRow">
            <span>End Time:</span>
            <TimeInput value={overtime.endTime} onChange={this.handleEndTimeChange} />
          </div>
          <div className="formRow">
            <span>Free date on:</span>
            <DatePicker selected={overtime.freeTimeOn ? moment(overtime.freeTimeOn,'DD.MM.YYYY') : ''} onChange={this.handleFreeTimeOnDateChange}
              className="overtimeDatePicker" dateFormat="DD.MM.YYYY" isClearable="true" placeholderText="Free time on"
              minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
              filterDate={(this.isWeekday)} />
          </div>
          <div className="formRow">
            <span>Comment:</span>
            <textarea id="comment" rows="6" value={overtime.comment} onChange={this.handleCommentChange} />
          </div>
        </div>
        <div className="footer">
          <button onClick={this.saveHandler}>Save</button>
          <Link to={'/'}>
            <button>Cancel</button>
          </Link>
        </div>
        <div className="validation">
          {this.state.validationMessage}
        </div>
      </div>
      }
      </div>
    );
  }
}

export default OvertimeDetail;
