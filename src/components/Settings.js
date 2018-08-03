import React from 'react';
import { Form, Text, Select } from 'react-form';
import Columns from 'react-columns';

import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';

class Settings extends React.Component {

    constructor() {
        super();
        this.state = {
            currentUser: UserStore.getCurrentUser(),
            users: UserStore.getUsers()
        };
        
        this.onChange = this.onChange.bind(this);
        this.onCurrentUserLoad = this.onCurrentUserLoad.bind(this);
    }

    componentWillMount() {
        UserStore.addChangeListener(this.onChange);
        UserStore.addSaveListener(this.onChange);
        UserStore.addCurrentUserLoadListener(this.onCurrentUserLoad)
    }

    componentDidMount() {
        if(!UserStore.hasCurrentUser()) {
            UserActions.getCurrentUser(UserStore.getTestCurrentUserId());
        }
        if(!UserStore.hasLoaded()) {
            UserActions.loadUsers();
        }
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
        UserStore.removeSaveListener(this.onChange);
        UserStore.removeCurrentUserLoadListener(this.onCurrentUserLoad);
    }

    onChange() {
        this.setState({
            users: UserStore.getUsers()
        });
    }

    onCurrentUserLoad() {
        this.setState({
            currentUser: UserStore.getCurrentUser()
        });
    }

    getPossibleTeamLeaders (users) {
        return users.filter((user) => {
            return user.roles.indexOf("TEAM_LEADER") >= 0;
        }).map((user) => {
            return {label: user.firstName + " " + user.lastName, value: user.id};
        });
    }

    getPossibleDirectors (users) {
        return users.filter((user) => {
            return user.roles.indexOf("DIRECTOR") >= 0;
        }).map((user) => {
            return {label: user.firstName + " " + user.lastName, value: user.id};
        });
    }

    getFullName (user) {
        if (user && user.firstName && user.lastName) {
            return user.firstName + " " + user.lastName;
        }
        return "";
    }

    persistSettings (settings) {
        
    }

    render() {
        return(
            <Form onSubmit={submittedValues => this.persistSettings(submittedValues)} >
                {formApi => (
                    <div className="editFormWrapper">
                        <form onSubmit={formApi.submitForm} id="settingsForm">
                            <div>
                                <label htmlFor="name">Name</label>
                                <Text field="name" id="name" />
                            </div>
                            <div>
                                <label htmlFor="teamLeader">Team Leader</label>
                                <Select field="teamLeader" id="teamLeader" options={this.getPossibleTeamLeaders(this.state.users)} />
                            </div>
                            <div>
                                <label htmlFor="director">Director of operations</label>
                                <Select field="director" id="director" options={this.getPossibleDirectors(this.state.users)} />
                            </div>
                            <div>
                                <button type="submit" className="mb-4 btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                )}
            </Form>
        );
    }
}

export default Settings;