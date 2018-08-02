import React from 'react';
import ReactTable from 'react-table';

class Users extends React.Component {

    constructor() {
        super();
        this.state ={users:[
            {name: "Grozea Maria", isTeamLeader: false, isDirector: false},
            {name: "Burada Mihai", isTeamLeader: false, isDirector: false},
            {name: "Onaca Teodora", isTeamLeader: false, isDirector: false},
            {name: "Rot Radu ", isTeamLeader: false, isDirector: false},
            {name: "Herman Karina", isTeamLeader: false, isDirector: false},
            {name: "Ciora Cristian", isTeamLeader: false, isDirector: false},
            {name: "Pentek Marius", isTeamLeader: false, isDirector: true},
            {name: "Nestorovici Alexander", isTeamLeader: true, isDirector: false},
            {name: "Fiat Filip", isTeamLeader: false, isDirector: false},
            {name: "Dume Marius", isTeamLeader: false, isDirector: false},
            {name: "Panta Diana", isTeamLeader: false, isDirector: false},
            {name: "Parta Dana", isTeamLeader: false, isDirector: false},
            {name: "Leontiuc Silvia", isTeamLeader: false, isDirector: false},
            {name: "Vidrascu Paul", isTeamLeader: false, isDirector: false},
            {name: "Mujat Mihai", isTeamLeader: false, isDirector: false},
            {name: "Mirea Adrian", isTeamLeader: true, isDirector: false},
        ]};
    }

    renderEditableCheckbox(cellInfo) {
        return (
            <input type="checkbox" checked={cellInfo.value} onChange={() => {
                alert("changed " + cellInfo.column.id);
                console.log(cellInfo);
            }}/>
        );
    }

    render() {
        const columns = [{
            Header: 'Name',
            accessor: 'name'
          }, {
            Header: 'Is Team Leader',
            accessor: 'isTeamLeader',
            Cell: this.renderEditableCheckbox
          }, {
            Header: 'Is Director',
            accessor: 'isDirector',
            Cell: this.renderEditableCheckbox
          }];
        return(
            <ReactTable defaultPageSize={10} data={this.state.users} columns={columns} />
        );
    }
}

export default Users;