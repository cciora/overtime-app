import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import AuthActions from '../actions/AuthActions';
// import AuthStore from '../stores/AuthStore';

class HeaderComponent extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: false
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    // We can call the show method from Auth0Lock,
    // which is passed down as a prop, to allow
    // the user to log in
    // this.props.lock.show((err, profile, token) => {
    //   if (err) {
    //     alert(err);
    //     return;
    //   }
    //   this.setState({authenticated: true});
    // });
    this.setState({authenticated: true});
  }

  logout() {
    // AuthActions.logUserOut();
    this.setState({authenticated: false});
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React Overtimes</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem><Link to={'/overtime/new'}>New Overtime</Link></NavItem>
          <NavItem onClick={this.login}>Login</NavItem>
          <NavItem onClick={this.logout}>Logout</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default HeaderComponent;