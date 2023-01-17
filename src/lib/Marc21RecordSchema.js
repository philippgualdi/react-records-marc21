// This file is part of Invenio.
//
// Copyright (C) 2021-2023 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.
import _set from "lodash/set";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Schema } from 'js-data';

export class Marc21RecordSchema {
  /**
   *  Make sure RecordSchema called first time with props.link
   */

  constructor(schema) {
    this.schema = {};
    this.leader_field = "LDR";
    if (schema !== {}) {
      this.setSchema(schema);
      this.loaded = true;
    } else {
      this.loaded = false;
    }
  }

  isReady() {
    return this.loaded;
  }

  setSchema(schema) {
    console.log("setSchema");
    this.schema = new Schema(schema);
  }

  marcjsToSchema(metadata){
    let toSchema = {};
    _set(toSchema, "leader", _get(metadata, "leader", ""));
    let fields =  _get(metadata, "fields", {})
    let internalFields = new Object();
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      let ne = new Object();
      ne.ind1 = field.ind1;
      ne.ind2 = field.ind2;
      let subfield = field.subfield;
      let test = subfield.trim().split("$$");
      let internalfield = new Object();
      for (let j = 0; j < test.length; j++) {
        if (_isEmpty(test[j])){
          continue
        }
        let code = test[j][0];
        let value = test[j].substring(1);
        _set(internalfield, code, [value.trim()]);

      }
      ne.subfields = internalfield;
      console.log(ne);
      _set(internalFields, field.id, [ne]);
    }
    _set(toSchema, "fields", internalFields);
    return toSchema;
  }


  validate(metadata){
    console.log("Validate");
    let internalrecord = this.marcjsToSchema(metadata);
    let errors = this.schema.validate(internalrecord);
    let frontendError = [];
    console.log(errors);
    for (let i = 0; i < errors.length; i++) {
      let path = errors[i].path.split(".");
      let index = metadata.fields.findIndex(x => x.id === path[1]);
      let obj = new Object();
      path[1] = index;
      path = ["metadata"].concat(path);
      obj[path.join(".")] = errors[i].expected
      frontendError.push(obj)
      
    }
    console.log(frontendError);
    return frontendError;
  }
}
