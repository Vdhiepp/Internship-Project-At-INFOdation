import React from "react";

const DeleteRoomModal = ({ room, onDelete, onCancel }) => {
    if (!room) return null;

    const handleDeleteClick = () => {
        console.log("Deleting room with ID:", room);  // Kiểm tra ID của phòng trước khi xóa
        onDelete(room);
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-25" style={{ zIndex: 1050 }}>
            <div className="delete-room-modal bg-light rounded shadow p-4">
                <div className="modal-title text-center">
                    <h4>Are you sure you want to delete this meeting room?</h4>
                    <p>{room.name}</p>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                    <button className="btn btn-danger me-2" onClick={handleDeleteClick}>
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

export default DeleteRoomModal;
