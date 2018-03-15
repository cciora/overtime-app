import React, { Component } from 'react';
import {default as ExcelFile, ExcelSheet, ExcelColumn} from 'react-data-export'

class ExcelExport extends Component {
    render() {
        return (
            <ExcelFile>
                <ExcelSheet data={this.props.overtimes} name="Overtime">
                    <ExcelColumn label="Date" value="date" />
                    <ExcelColumn label="Start Time" value="startTime" />
                    <ExcelColumn label="End Time" value="endTime" />
                    <ExcelColumn label="Free Time On" value="freeTimeOn" />
                    <ExcelColumn label="Comment" value="comment" />
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

export default ExcelExport;
