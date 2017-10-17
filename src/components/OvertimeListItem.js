import React from 'react';
import { Link } from 'react-router-dom';

class TableRow extends React.Component {
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
            <span className="rowEdit">Edit</span>
          </Link>
          <span className="rowDelete" onClick={() => this.props.deleteRow(overtime.id)}>Delete</span>
        </td>
      </tr>
    );
  }
}

export default TableRow;
