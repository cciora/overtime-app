import React from 'react';
import { Form, Text, Select } from 'react-form';
import Columns from 'react-columns'

class Settings extends React.Component {

    getPossibleTeamLeaders () {
        return [
            {label: "Alexander Nestorovici", value: "anestorovici"},
            {label: "Adrian Mirea", value: "amirea"}
        ];
    }

    getPossibleDirectors () {
        return [
            {label: "Marius Pentek", value: "mpentek"}
        ];
    }

    render() {
        return(
            <Form onSubmit={submittedValues => this.setState({ submittedValues })}>
                {formApi => (
                    <div className="editFormWrapper">
                    <form onSubmit={formApi.submitForm} id="settingsForm">
                            <div>
                                <label htmlFor="name">Name</label>
                                <Text field="name" id="name" />
                            </div>
                            <div>
                                <label htmlFor="teamLeader">Team Leader</label>
                                <Select field="teamLeader" id="teamLeader" options={this.getPossibleTeamLeaders()} />
                            </div>
                            <div>
                                <label htmlFor="director">Director of operations</label>
                                <Select field="director" id="director" options={this.getPossibleDirectors()} />
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