import React from 'react';
import ReactTable from 'react-table';

import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';

class Users extends React.Component {

    constructor() {
        super();
        this.state = {
            users: UserStore.getUsers()
        };

        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        UserStore.addChangeListener(this.onChange);
        UserStore.addSaveListener(this.onChange);
    }

    componentDidMount() {
        if(!UserStore.hasLoaded()) {
            UserActions.loadUsers();
        }
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
        UserStore.removeSaveListener(this.onChange);
    }

    onChange() {
        this.setState({
            users: UserStore.getUsers()
        });
    }

    renderEditableCheckbox(cellInfo) {
        return (
            <input type="checkbox" checked={cellInfo.original.roles.includes(cellInfo.column.id)} onChange={(e) => {
                var user = cellInfo.original;
                if(e.target.checked){
                    user.roles.push(cellInfo.column.id);
                } else {
                    user.roles.splice(user.roles.indexOf(cellInfo.column.id),1);
                }
                UserActions.saveUser(user);
            }}/>
        );
    }

    render() {
        const columns = [{
            Header: 'First Name',
            accessor: 'firstName'
          }, {
            Header: 'Last Name',
            accessor: 'lastName'
          }, {
            Header: 'Is Team Leader',
            accessor: 'TEAM_LEADER',
            Cell: this.renderEditableCheckbox
          }, {
            Header: 'Is Director',
            accessor: 'DIRECTOR',
            Cell: this.renderEditableCheckbox
          }];
        return(
            <ReactTable defaultPageSize={10} data={this.state.users} columns={columns} />
        );
    }
}

export default Users;