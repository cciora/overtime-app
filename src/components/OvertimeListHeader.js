import React from 'react';

class TableHeader extends React.Component {
  render() {
    return (
      <tr className="header">
        <td width="15%">Date</td>
        <td width="10%">Start time</td>
        <td width="10%">End time</td>
        <td width="15%">Free time on</td>
        <td>Comment</td>
        <td width="10%">Actions</td>
      </tr>
    );
  }
}

export default TableHeader;
