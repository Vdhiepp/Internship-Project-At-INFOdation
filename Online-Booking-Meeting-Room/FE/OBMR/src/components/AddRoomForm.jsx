import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";


const AddRoomForm = ({ onClose, onSubmit }) => {
  const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'+07:00'");
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    createdAt: currentDate,
    updatedAt: currentDate
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của dữ liệu
    if (!formData.name || !formData.capacity) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("/api/meeting-rooms", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        onSubmit(response.data); // Assuming onSubmit expects the new room data
        onClose();
        Swal.fire({
          title: "A room has been created!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (response.status === 403) {
        setError("You don't have permission to add a room.");
      } else {
        setError(response.data.message || "An error occurred while adding the room.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred while adding the room.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    console.log("New Room Data:", formData);
    onClose(); // Đóng form
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
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
          <h4 className="mb-3 fw-bold" style={{ color: "#1B374D" }}>CREATE MEETING ROOM</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Room Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">Capacity</label>
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
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}

            ></textarea>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-add-room px-5">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomForm;
