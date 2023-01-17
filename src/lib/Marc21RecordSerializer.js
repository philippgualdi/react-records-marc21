// This file is part of Invenio.
//
// Copyright (C) 2021-2022 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import _cloneDeep from "lodash/cloneDeep";
import _defaults from "lodash/defaults";
import _pick from "lodash/pick";
import _set from "lodash/set";
import _get from "lodash/get";
import { DepositRecordSerializer } from "react-invenio-deposit";
import { Field, Marc21MetadataFields } from "./fields";

export class Marc21RecordSerializer extends DepositRecordSerializer {
  constructor(defaultLocale) {
    super();
    this.defaultLocale = defaultLocale;
    this.current_record = {};
  }

  depositRecordSchema = {
    access: new Field({
      fieldpath: "access",
      deserializedDefault: {
        record: "public",
        files: "public",
      },
    }),
    files: new Field({
      fieldpath: "files",
    }),
    links: new Field({
      fieldpath: "links",
    }),
    parent: new Field({
      fieldpath: "parent",
    }),
    pids: new Field({
      fieldpath: "pids",
      deserializedDefault: {},
      serializedDefault: {},
    }),
    metadata: new Marc21MetadataFields({
      fieldpath: "metadata",
      deserializedDefault: { leader: "00000nam a2200000zca4500", fields: [] },
      serializedDefault: "",
    }),
  };

  /**
   * Deserialize backend record into format compatible with frontend.
   * @method
   * @param {object} record - potentially empty object
   * @returns {object} frontend compatible record object
   */
  deserialize(record) {
    record = _cloneDeep(record);

    let deserializedRecord = record;
    deserializedRecord = _pick(deserializedRecord, [
      "access",
      "expanded",
      "metadata",
      "id",
      "links",
      "files",
      "is_published",
      "versions",
      "parent",
      "status",
      "pids",
    ]);
    for (let key in this.depositRecordSchema) {
      deserializedRecord =
        this.depositRecordSchema[key].deserialize(deserializedRecord);
    }

    this.current_record = deserializedRecord;
    return deserializedRecord;
  }

  /**
   * Deserialize backend record errors into format compatible with frontend.
   * @method
   * @param {array} errors - array of error objects
   * @returns {object} - object representing errors
   */
  deserializeErrors(errors) {
    let deserializedErrors = [];
    // for (let e of errors) {
    //   keys = e.field.split(".");
    //   if (keys[0] == "metadata") {
    //     if (keys[1] == "fields") {
    //       let fields = _get(this.current_record, "metadata.fields");
    //       for (let key in fields) {
    //       }
    //     }
    //   }
      //deserializedErrors.push({e.field: e.messages.join(" ")});
    //}

    // TODO - WARNING: This doesn't convert backend error paths to frontend
    //                 error paths. Doing so is non-trivial
    //                 (re-using deserialize has some caveats)
    //                 Form/Error UX is tackled in next sprint and this is good
    //                 enough for now.
    for (const e of errors) {
      let keys = e.field.split(".");
      keys.shift();
      let field = keys.join(".")
      _set(deserializedErrors, field, e.messages.join(" "));
    }
    return deserializedErrors;
  }

  /**
   * Serialize record to send to the backend.
   * @method
   * @param {object} record - in frontend format
   * @returns {object} record - in API format
   *
   */
  serialize(record) {
    record = _cloneDeep(record);
    let serializedRecord = record; //this.removeEmptyValues(record);
    serializedRecord = _pick(serializedRecord, [
      "access",
      "metadata",
      "id",
      "links",
      "files",
      "pids",
      "parent",
    ]);
    for (let key in this.depositRecordSchema) {
      serializedRecord = this.depositRecordSchema[key].serialize(serializedRecord);
    }

    _defaults(serializedRecord, { metadata: {} });

    return serializedRecord;
  }
}
