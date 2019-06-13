import React, { Component } from 'react';
import Select from 'react-select';

import logo from './logo.svg';
import './App.css';

import _ from 'lodash';


class CompanyDropdownList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompanyOption: null
    }
  }

  render() {
    return (
      <div>
        <Select
          options={this.props.companyOptions}
          value={this.state.selectedOption}
          onChange={this.props.selectedCompanyChangedHandler}
        />
        </div>
    );
  }
}

export default CompanyDropdownList;
