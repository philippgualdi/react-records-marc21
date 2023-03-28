// This file is part of Invenio.
//
// Copyright (C) 2023 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Container } from "semantic-ui-react";
class DepositHeaderComponent extends Component {
  render() {
    const { showDepositHeader } = this.props;

    return (
      showDepositHeader && (
        <Container
          className="page-subheader-outer compact ml-0-mobile mr-0-mobile"
          fluid
        >
          <Container className="page-subheader">
            <div className="community-header-element rel-ml-1"></div>
          </Container>
        </Container>
      )
    );
  }
}

DepositHeaderComponent.propTypes = {
  showDepositHeader: PropTypes.bool.isRequired,
};

DepositHeaderComponent.defaultProps = {
  showDepositHeader: undefined,
};

export const Marc21DepositHeader = DepositHeaderComponent;
