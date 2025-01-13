import { useEffect, useState } from "react";
import EventTable from "../../components/events_table/EventsTable";
import "../../styles/RoomController.css";
import AddEventForm from "../../components/AddRoomForm";
import axios from "axios";

const EventController = () => {
    const [isAddEventVisible, setAddEventVisible] = useState(false);
    const [eventData, setEventData] = useState([]); // State để lưu danh sách sự kiện
    const [searchQuery, setSearchQuery] = useState(""); // State để lưu từ khóa tìm kiếm

    // Gọi API để lấy danh sách sự kiện
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/event-meetings") // Thay API endpoint thành sự kiện
            .then((response) => {
                console.log(response.data);
                setEventData(response.data); // Lưu dữ liệu vào state
            })
            .catch((error) => {
                console.error("Error fetching event data:", error);
            });
    }, []);

    // Hàm tìm kiếm
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Cập nhật từ khóa tìm kiếm khi người dùng nhập
    };

    // Lọc dữ liệu sự kiện theo từ khóa tìm kiếm
    const filteredEventData = eventData.filter(
        (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) || // Tìm kiếm theo tên sự kiện
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) || // Tìm kiếm theo mô tả sự kiện
            (event.meetingRoom && event.meetingRoom.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAddEvent = (newEvent) => {
        setEventData((prevEvents) => [...prevEvents, newEvent]);
    };

    const handleEditEvent = async (updatedEvent) => {
        try {
            const response = await fetch(`http://localhost:8080/api/events/${updatedEvent.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });
            if (response.ok) {
                setEventData((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === updatedEvent.id ? updatedEvent : event
                    )
                );
                Swal.fire({
                    title: "An event has been updated!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                console.log('Event updated successfully');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                });
                console.error('Failed to update event');
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    // Handle deleting an event
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the event from the list
                setEventData((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

                // Hiển thị thông báo thành công
                Swal.fire({
                    title: "An event has been deleted!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                console.log(`Event with ID ${eventId} has been deleted.`);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                });
                console.error(`Failed to delete event with ID ${eventId}.`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="px-3 py-3 room-page">
            <h4>Event Controller</h4>
            <div className="room-table p-3 shadow rounded">
                <div className="d-flex justify-content-between">
                    <div className="event-filter d-flex justify-content-start">
                        <input
                            id="searchEvent"
                            className="px-2 rounded ms-3 shadow search-input py-2"
                            type="text"
                            placeholder="Search..."
                            value={searchQuery} // Liên kết với state
                            onChange={handleSearchChange} // Cập nhật state khi người dùng nhập
                        />
                    </div>
                    {/* <button
                        id="addEvent"
                        className="btn btn-add-event shadow rounded me-3 px-4"
                        onClick={() => setAddEventVisible(true)}
                    >
                        + Add New Event
                    </button> */}
                    {isAddEventVisible && (
                        <AddEventForm
                            onClose={() => setAddEventVisible(false)}
                            onSubmit={handleAddEvent}
                        />
                    )}
                </div>
                <div className="p-3">
                    <EventTable
                        eventData={filteredEventData} // Truyền filteredEventData thay vì eventData
                        onDelete={handleDeleteEvent}
                        onEdit={handleEditEvent}
                    />
                </div>
            </div>
        </div>
    );
};

export default EventController;
