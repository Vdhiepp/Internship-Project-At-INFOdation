import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Members from "./member";
import axios from "axios";

const BookingForm = ({ onClose, onSubmit, initialData = {}, readOnly = false }) => {
  const [locations, setLocations] = useState([]);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/meeting-rooms");
        const eventsResponse = await axios.get("http://localhost:8080/api/event-meetings");

        setLocations(response.data);
        setEvents(eventsResponse.data);

      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const getRoomStatus = (roomId) => {
    const formStartTime = new Date(`${startDate}T${startTime}:00`);
    const formEndTime = new Date(`${endDate}T${endTime}:00`);

    if (isNaN(formStartTime.getTime()) || isNaN(formEndTime.getTime())) {
      return "Free";
    }


    const roomEvents = events.filter((event) => {
      if (event.meetingRoom && event.meetingRoom.id === roomId) {
        return true;
      }
      return false;
    });
    for (const event of roomEvents) {
      const eventStartTime = new Date(event.startTime);
      const eventEndTime = new Date(event.endTime);

      if (
        event.status !== "CANCELLED" &&
        (
          (formStartTime < eventEndTime && formEndTime > eventStartTime)
        )
      ) {
        return "Booked";
      }
    }

    return "Free";
  };


  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(new Date(), 'HH:mm'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState(format(new Date(), 'HH:mm'));

  const [formData, setFormData] = useState({
    title: "",
    startDate: startDate,
    startTime: startTime,
    endDate: endDate,
    endTime: endTime,
    description: "",
    menber: "",
    status: "WAITING",
    location: "",
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "startTime") {
      setStartTime(value);
    } else if (name === "endDate") {
      setEndDate(value);
    } else if (name === "endTime") {
      setEndTime(value);
    };

    setFormData({ ...formData, [name]: value });

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
    };

    console.log("Submitted Data:", finalData);
    onSubmit(finalData);
    onClose();
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
      <div className="bg-white p-5 rounded shadow" style={{ width: "800px", position: "relative" }}>
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
          <h4 className="mb-3 fw-bold" style={{ color: "#1B374D" }}>EVENT MEETING</h4>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex-grow-1">
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Add title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 flex-grow-1">
            <Members />
          </div>
          <div className="mb-3 d-flex align-items-center">
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="form-control"
              value={startDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              id="startTime"
              name="startTime"
              className="form-control ms-2"
              value={startTime}
              onChange={handleChange}
              required
            />
            <i className="fa-solid fa-arrow-right mx-3"></i>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="form-control"
              value={endDate}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              id="endTime"
              name="endTime"
              className="form-control ms-2"
              value={endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 flex-grow-1">
            <select
              id="location"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {locations
                .filter(location => getRoomStatus(location.id) !== "Booked") // Loại bỏ các phòng có trạng thái BOOKED
                .map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                     {/* - {getRoomStatus(location.id)} */}
                  </option>
                ))}
            </select>
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
            <button type="submit" className="btn btn-new-meeting px-5">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
