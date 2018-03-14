import React from 'react';
import { Link } from 'react-router-dom';
import OvertimeAction from '../actions/OvertimeActions';
import OvertimeStore from '../stores/OvertimeStore';
//import Modal from 'react-modal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

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
    OvertimeStore.addSaveListener(this.onValidation);
  }

  componentDidMount() {
      OvertimeAction.getOvertime(this.props.match.params.id);
  }

  componentWillUnmount() {
    OvertimeStore.removeChangeListener(this.onChange);
    OvertimeStore.removeSaveListener(this.onValidation);
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
    temp.date = date ? date.format('YYYY-MM-DD') : null;
    this.setState({overtime: temp});
  }

  handleStartTimeChange(val) {
    let temp = Object.assign({}, this.state.overtime);
    temp.startTime = val ? val.format('HH:mm') : '';
    this.setState({overtime: temp});
  }

  handleEndTimeChange(val) {
    let temp = Object.assign({}, this.state.overtime);
    temp.endTime = val ? val.format('HH:mm') : '';
    this.setState({overtime: temp});
  }

  handleFreeTimeOnDateChange(date) {
    let temp = Object.assign({}, this.state.overtime);
    temp.freeTimeOn = date ? date.format('YYYY-MM-DD') : null;
    this.setState({overtime: temp});
  }

  handleCommentChange(event) {
    let temp = Object.assign({}, this.state.overtime);
    temp.comment = event.target.value;
    this.setState({overtime: temp});
  }

  // function getEntryDurationInMinutes(e) {
  //   return getTimeStringInMinutes(e.endTime) - getTimeStringInMinutes(e.startTime);
  // }

  timeStringToMinutes(str) {
    const time = str.split(':');
    return parseInt(time[0])*60 + parseInt(time[1]);
  }

  isValidOvertime() {
    // the date is mandatory
    if(!this.state.overtime.date || !moment(this.state.overtime.date).isValid()) {
      this.setState({validationMessage: 'Please specify a valid date!'});
      return false;
    }
    if(!this.state.overtime.startTime){
      this.setState({validationMessage: 'Start Time is mandatory!'});
      return false;
    }
    if(!this.state.overtime.endTime){
      this.setState({validationMessage: 'End Time is mandatory!'});
      return false;
    }

    // check the time interval is correct (startTime before endTime)
    const startTime = this.timeStringToMinutes(this.state.overtime.startTime);
    const endTime = this.timeStringToMinutes(this.state.overtime.endTime);
    if(endTime <= startTime) {
      this.setState({validationMessage: 'Start time should be before the end time!'});
      return false;
    }

    let totalDuration = endTime - startTime;
    let overtimes = OvertimeStore.getOvertimes(this.state.overtime.date, this.state.overtime.date);
    for(let i=0; i<overtimes.length; i++) {
      let o = overtimes[i];
      if(o.id != this.state.overtime.id) {
        const oStartTime = this.timeStringToMinutes(o.startTime);
        const oEndTime = this.timeStringToMinutes(o.endTime);
        // check the time interval does not overlap with another one
        if( (startTime >= oStartTime && startTime < oEndTime)
              || (oStartTime >= startTime && oStartTime < endTime)
              || (startTime <= oStartTime && endTime >= oEndTime)
              || (oStartTime <= startTime && oEndTime >= endTime)){
          this.setState({validationMessage: 'The current overtime is overlapping with another one!'});
          return false;
        }
        totalDuration += (oEndTime - oStartTime);
      }
    }
      // check there are maximum 3h/day
    if(totalDuration > 180) {
      this.setState({validationMessage: 'Total overtime in one day cannot be more than 3h!'});
      return false;
    }
    return true;
  }

  saveHandler() {
    if(this.isValidOvertime()) {
      this.setState({validationMessage: ''});
      OvertimeAction.saveOvertime(this.state.overtime);
    }
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
        <div className="row50l">
          <label for="dateInput">Date:</label>
          <DatePicker id="dateInput" selected={overtime.date ? moment(overtime.date) : ''}
            onChange={this.handleOvertimeDateChange}
            dateFormat="YYYY-MM-DD" placeholderText="Date" required="true"
            minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
            filterDate={(this.isWeekday)} />
        </div>
        <div className="row50r">
          <label for="freeTimeOnInput">Free date on:</label>
          <DatePicker id="freeTimeOnInput" selected={overtime.freeTimeOn ? moment(overtime.freeTimeOn) : ''} onChange={this.handleFreeTimeOnDateChange}
            className="overtimeDatePicker" dateFormat="YYYY-MM-DD" isClearable="true" placeholderText="Free time on"
            minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
            filterDate={(this.isWeekday)} />
        </div>
        <div className="row50l">
          <label for="startTimeInput">Start Time:</label>
          <TimePicker id="startTimeInput" showSecond={false} minuteStep={15} inputReadOnly={true}
            defaultValue={moment('18:00','HH:mm')} value={moment(overtime.startTime,'HH:mm')}
            onChange={this.handleStartTimeChange}  />
        </div>
        <div className="row50r">
          <label for="endTimeInput">End Time:</label>
          <TimePicker id="endTimeInput" showSecond={false} minuteStep={15} inputReadOnly={true}
            defaultValue={moment('19:00','HH:mm')} value={moment(overtime.endTime,'HH:mm')}
            onChange={this.handleEndTimeChange} />
        </div>
        <div className="row100">
          <label for="commentInput">Comment:</label>
          <textarea id="commentInput" rows="6" value={overtime.comment} onChange={this.handleCommentChange} />
        </div>
        <div className="footer">
          <div>
            <button onClick={this.saveHandler}>Save</button>
          </div>
          <div>
            <Link to={'/'}>
              <button>Cancel</button>
            </Link>
          </div>
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
