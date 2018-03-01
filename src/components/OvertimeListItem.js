import React from 'react';
import { Link } from 'react-router-dom';
import OvertimeAction from '../actions/OvertimeActions';

class TableRow extends React.Component {
  deleteOvertime(id) {
    if (window.confirm('Are you sure you want to delete?')) {
      OvertimeAction.deleteOvertime(id);
    }
  }

  render() {
    const { overtime } = this.props;
    return (
      <tr>
        <td>{overtime.date}</td>
        <td>{overtime.startTime}</td>
        <td>{overtime.endTime}</td>
        <td>{overtime.freeTimeOn}</td>
        <td>{overtime.comment}</td>
        <td>
          <Link to={`/overtime/${overtime.id}`}>
            <span className="rowEdit">&nbsp;</span>
          </Link>
          <span className="rowDelete" onClick={() => this.deleteOvertime(overtime.id)}>&nbsp;</span>
        </td>
      </tr>
    );
  }
}

export default TableRow;
