import React, { useState, useEffect } from 'react';

const EditRoomModal = ({ room, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        capacity: "",
        description: "",
    });

    useEffect(() => {
        // Update form data when receiving a room to edit
        if (room) {
            setFormData({
                id: room.id || "",
                name: room.name || "",
                capacity: room.capacity || "",
                description: room.description || "",
            });
        }
    }, [room]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        console.log(formData); // Send updated data to parent
        onClose();  // Close modal after submit
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-25" style={{ zIndex: 1050 }}>
            <div className="bg-white p-5 rounded shadow" style={{ width: "500px", position: "relative" }}>
                <button
                    onClick={onClose}
                    className="close-button position-absolute top-0 end-0 btn btn-link"
                    style={{
                        fontSize: "1.5rem",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: "0.5rem",
                        height: "50px",
                        width: "50px",
                        color: "#1B374D",
                    }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="d-flex justify-content-center">
                    <h4 className="mb-3 fw-bold" style={{ color: "#1B374D" }}>EDIT ROOM</h4>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Removed hidden input for ID */}
                    <div className="mb-3 flex-grow-1">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Room Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3 flex-grow-1">
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            className="form-control"
                            placeholder="Capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-add-room px-5">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRoomModal;
