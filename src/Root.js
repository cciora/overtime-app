//import 'normalize.css/normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/Header';

import OvertimeOverview from './components/OvertimeOverview';
import OvertimeDetail from './components/OvertimeDetail';

import { Grid, Row, Col } from 'react-bootstrap';

class Root extends Component {

  // We need to provide a list of routes
  // for our app, and in this case we are
  // doing so from a Root component
  render() {
    return (
      <BrowserRouter>
        <div>
        <Header lock={this.lock}></Header>
        <Grid>
          <Row>
            <Col xs={12} md={9}>
              <Route exact path='/' component={OvertimeOverview} />
              <Route path='/overtime/:id' component={OvertimeDetail} />
            </Col>
          </Row>
        </Grid>
      </div>
      </BrowserRouter>
    );
  }
}

export default Root;