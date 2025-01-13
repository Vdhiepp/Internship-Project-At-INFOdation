import React, { useState } from 'react';
import "../styles/EventModal.css"
import { format } from 'date-fns';
import DeleteEventModal from './deleteEventModal';
import EditEventModal from './editEventModal';
import axios from 'axios';


const EventModal = ({ event, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async (eventId) => {
    console.log('Event Deleted:', eventId);

    try {
      const response = await axios.delete(`/api/event-meetings/${eventId}`);

      if (response.status === 200 || response.status === 204) {
        sessionStorage.setItem('successMessage', 'Event deleted successfully!');
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteBtnClick = () => {
    setShowDeleteModal(true);
  }

  const handleEditBtnClick = () => {
    setEditMode(true);
  }

  const handleEditSubmit = async (updatedData) => {
    const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'+07:00'");
    const startDateTime = `${updatedData.startDate}T${updatedData.startTime}:00+07:00`;
    const endDateTime = `${updatedData.endDate}T${updatedData.endTime}:00+07:00`;

    const dataToSend = {
      id: event.id,
      title: updatedData.title,
      startTime: startDateTime,
      endTime: endDateTime,
      description: updatedData.description,
      status: updatedData.status,
      createdAt: updatedData.createdAt,
      updatedAt: currentDate,
      meetingRoom: { id: updatedData.location },  // Giữ ID phòng họp
    };

    console.log("Updated Meeting Data Submitted:", dataToSend);

    try {
      // Gọi API để cập nhật sự kiện với id tương ứng
      const response = await axios.put(`/api/event-meetings/${event.id}`, dataToSend);

      if (response.status === 200) {
        sessionStorage.setItem('successMessage', 'Event updated successfully!');
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }

    onClose();  // Đóng modal sau khi hoàn tất chỉnh sửa
  };

  const closeEventModal = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    // Ngăn không cho sự kiện click vào modal đóng modal
    e.stopPropagation();
  };

  if (!event) return null;

  return (
    <div onClick={closeEventModal} className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-25' style={{ zIndex: 1050 }}>
      <div onClick={handleModalClick} className="my-event-modal p-3">
        <div className='button-area'>
          <button className='btn btn-modal' onClick={handleEditBtnClick}><i className="fa-solid fa-pen" aria-hidden="true"></i></button>
          {showDeleteModal && (
            <DeleteEventModal
              event={event}
              onDelete={handleDelete}
              onCancel={handleCancelDelete}
            />
          )}
          <button className='btn btn-modal' onClick={handleDeleteBtnClick}><i className="fa-solid fa-trash" aria-hidden="true"></i></button>
        </div>
        <div className="my-event-modal-title">
          <i className="fa-regular fa-calendar-days me-2"></i>
          {event.title}
        </div>
        <div className='mt-2'>
          <i className="fa fa-clock-o me-2" aria-hidden="true"></i>
          {format(event.start, "MMM d, yyyy")} | {format(event.start, "H:mm a")} - {format(event.end, "H:mm a")}
        </div>
        <div className='mt-2'>
          <i className="fa fa-location-dot me-2"></i>
          {event.location}
        </div>
        <div className='mt-2'>
          <i className="fa-regular fa-user me-2"></i>
          Member: {event.people}
        </div>
        <div className='mt-2'>
          Description: {event.description}
        </div>
        {editMode && (
          <EditEventModal
            event={event}
            onClose={onClose}
            onSubmit={handleEditSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default EventModal;

