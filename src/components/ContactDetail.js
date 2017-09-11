import React, { Component } from 'react';
import ContactActions from '../actions/ContactActions';
import ContactStore from '../stores/ContactStore';

class ContactDetailComponent extends Component {

  constructor() {
    super();
    this.state = {
      contact: {}
    }
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    ContactStore.addChangeListener(this.onChange);
  }

  componentDidMount() {
    ContactActions.getContact(this.props.match.params.id);
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      contact: ContactActions.getContact(nextProps.match.params.id)
    });
  }

  onChange() {
    this.setState({
      contact: ContactStore.getContact(this.props.match.params.id)
    });
  }

  render() {
    let contact;
    if (this.state.contact && this.state.contact[0]) {
      contact = this.state.contact[0];
    }
    return (
      <div>
          <span>Details:</span>
        { this.state.contact && this.state.contact[0] &&
          <div>
            <img src={contact.image} width="150" />
            <h1>{contact.name}</h1>
            <h3>{contact.email}</h3>
          </div>
        }
      </div>
    );
  }
}

export default ContactDetailComponent;