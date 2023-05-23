// This file is part of InvenioRDM
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// Invenio App RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from "lodash/get";
import _isObject from "lodash/isObject";
import { FormFeedback } from "react-invenio-deposit";

class Marc21FormFeedback extends FormFeedback {
  constructor(props) {
    super(props);
    this.labels = {
      ...defaultLabels,
      ...props.labels,
    };
  }

  /**
   * Return array of error messages from errorValue object.
   *
   * The error message(s) might be deeply nested in the errorValue e.g.
   *
   * errorValue = [
   *   {
   *     title: "Missing value"
   *   }
   * ];
   *
   * @param {object} errorValue
   * @returns array of Strings (error messages)
   */
  toErrorMessages(errorValue) {
    let messages = [];
    let store = (l) => {
      messages.push(l);
    };
    leafTraverse(errorValue, store);
    return messages;
  }

  /**
   * Return object with human readbable labels as keys and error messages as
   * values given an errors object.
   *
   * @param {object} errors
   * @returns object
   */
  toLabelledErrorMessages(errors) {
    // Step 0 - Create object with collapsed 1st and 2nd level keys
    //          e.g., {metadata: {creators: ,,,}} => {"metadata.creators": ...}
    // For now, only for metadata, files and access.embargo

    const files = errors.files || {};
    const step0Files = Object.entries(files).map(([key, value]) => {
      return ["files." + key, value];
    });
    const access = errors.access?.embargo || {};
    const step0Access = Object.entries(access).map(([key, value]) => {
      return ["access.embargo." + key, value];
    });
    const pids = errors.pids || {};
    const step0Pids = _isObject(pids)
      ? Object.entries(pids).map(([key, value]) => {
          return ["pids." + key, value];
        })
      : [["pids", pids]];
    const customFields = errors.custom_fields || {};
    const step0CustomFields = Object.entries(customFields).map(([key, value]) => {
      return ["custom_fields." + key, value];
    });
    const step0 = Object.fromEntries(
      step0Metadata
        .concat(step0Files)
        .concat(step0Access)
        .concat(step0Pids)
        .concat(step0CustomFields)
    );

    // Step 1 - Transform each error value into array of error messages
    const step1 = Object.fromEntries(
      Object.entries(step0).map(([key, value]) => {
        return [key, this.toErrorMessages(value)];
      })
    );

    // Step 2 - Group error messages by label
    // (different error keys can map to same label e.g. title and
    // additional_titles)
    const labelledErrorMessages = {};
    for (const key in step1) {
      let label = key;
      if (!key.startsWith("metadata")) {
        label = this.labels[key] || "Unknown field";
      }
      let messages = labelledErrorMessages[label] || [];
      labelledErrorMessages[label] = messages.concat(step1[key]);
    }

    return labelledErrorMessages;
  }
}

Marc21FormFeedback.propTypes = {
  errors: PropTypes.object,
  actionState: PropTypes.string,
  labels: PropTypes.object,
};

Marc21FormFeedback.defaultProps = {
  errors: undefined,
  actionState: undefined,
  labels: undefined,
};

export const Marc21FormFeedback;
