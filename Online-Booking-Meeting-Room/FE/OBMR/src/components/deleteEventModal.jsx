import React from 'react';
// import "../styles/DeleteEventModal.css";

const DeleteEventModal = ({ event, onDelete, onCancel }) => {
  if (!event) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="delete-event-modal p-4">
        <div className="modal-title text-center">
          <h4>Are you sure you want to cancel this event meeting?</h4>
        </div>
        <div className="modal-footer d-flex justify-content-center">
          <button className="btn btn-danger me-2" onClick={() => onDelete(event.id)}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
