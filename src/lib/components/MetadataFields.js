// This file is part of Invenio.
//
// Copyright (C) 2021-2022 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import React, { Component } from "react";
import { FieldArray } from "formik";
import PropTypes from "prop-types";
import { Button, Form, Icon } from "semantic-ui-react";
import { ArrayField, GroupField } from "react-invenio-forms";
import { MetadataField } from "./MetadataField";
import { LeaderField } from "./LeaderField";

export class MetadataFields extends Component {
  constructor(props) {
    super(props);
    this.validator = props.validator;
  }

  render() {
    const { fieldPath, errors } = this.props;
    //const error = getIn(errors, fieldPath, null);
    return (
      <>
        <GroupField fieldPath={`${fieldPath}.leader`} className={"leader"}>
          <LeaderField fieldPath={`${fieldPath}.leader`} />
        </GroupField>
        <FieldArray
          addButtonLabel={"Add"}
          fieldPath={`${fieldPath}.fields`}
          defaultNewValue={{ id: "", ind1: "", ind2: "", subfield: "$$" }}
          className="marcxml metadata fields."
          component={(formikProps) => (
            <MetadataField {...formikProps} {...this.props} />
          )}
        ></FieldArray>
      </>
    );
  }
}

MetadataFields.propTypes = {
  fieldPath: PropTypes.string,
  validationSchema: PropTypes.object,
};

MetadataFields.defaultProps = {
  fieldPath: "metadata",
  validationSchema: {},
};
