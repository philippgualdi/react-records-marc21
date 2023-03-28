import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";

const ConfirmationModal = (props) => {
  const { showModal, handleClose } = props;

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>

      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  handleClose: PropTypes.string.isRequired,
  showModal: PropTypes.string.isRequired,
};

ConfirmationModal.defaultProps = {
  showModal: "close",
};
