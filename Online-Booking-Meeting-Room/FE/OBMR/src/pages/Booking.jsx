import React, { useState, useEffect } from "react";
import "../styles/Booking.css";
import BasicDateCalendar from "../components/calender";
import ScheduleApp from "../components/Schedule";
import BookingForm from "../components/BookingForm";
import { format, parse } from 'date-fns';
import BookingItem from "../components/BookingItem";
import { useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Booking = () => {


    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm state loading

    const idToken = localStorage.getItem("id_token");

    const decodedToken = jwtDecode(idToken);

    const fetchEventsByUsername = async () => {
        // const apiUrl = `http://localhost:8080/api/events-by-username/${decodedToken.sub}`;
        const apiUrl = `http://localhost:8080/api/event-meetings`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${idToken}`, // Đính kèm token vào header nếu cần xác thực
                },
            });
            const eventsData = response.data.map(event => ({
                id: event.id.toString(), // Chuyển id thành chuỗi nếu cần
                title: event.title,
                description: event.description,
                location: event.meetingRoom ? event.meetingRoom.name : 'Unknown',
                start: event.startTime ? format(event.startTime, "yyyy-MM-dd HH:mm") : '',
                end: event.endTime ? format(event.endTime, "yyyy-MM-dd HH:mm") : '',
            }));
            setEvents(eventsData);
            setLoading(false); // Đánh dấu là đã tải xong
        } catch (error) {
            console.error("Error fetching events: ", error);
            setLoading(false); // Đánh dấu là đã tải xong dù có lỗi
        }
    };

    useEffect(() => {
        fetchEventsByUsername();
    }, []);

    const { isSidebarOpen } = useOutletContext();
    const [todayEvents, setTodayEvents] = useState([]);

    useEffect(() => {
        // Lọc các sự kiện có ngày trùng với ngày hôm nay
        const eventsToday = events.filter(event => {
            // Phân tích chuỗi ngày giờ của event.start
            const eventDate = parse(event.start, 'yyyy-MM-dd HH:mm', new Date());
            const currentDate = new Date();

            // So sánh ngày của event với ngày hiện tại
            return format(eventDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
        });

        setTodayEvents(eventsToday);
    }, [events]);

    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleNewMeetingClick = () => {
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
    };

    const handleFormSubmit = async (formData) => {
        const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'+07:00'");
        const startDateTime = `${formData.startDate}T${formData.startTime}:00+07:00`;
        const endDateTime = `${formData.endDate}T${formData.endTime}:00+07:00`;

        const dataToSend = {
            title: formData.title,
            startTime: startDateTime,
            endTime: endDateTime,
            description: formData.description,
            status: formData.status,
            createdAt: currentDate,
            updatedAt: currentDate,
            meetingRoom: { id: formData.location },  // Nếu cần dùng ID của phòng
        };

        console.log("Meeting Data Submitted:", dataToSend);

        try {
            // Gọi API để tạo sự kiện
            const response = await axios.post('/api/event-meetings', dataToSend);

            if (response.status === 201) {
                sessionStorage.setItem('successMessage', 'Event created successfully!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }

        console.log("Meeting Data Submitted:", formData);
    };

    if (loading) {
        return <div style={{ height: "calc(100vh - 70px - 40px)" }}>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu
    }
    const message = sessionStorage.getItem('successMessage');
    if (message) {
        Swal.fire({
            title: message,
            icon: "success",
        });
        sessionStorage.removeItem('successMessage');
    }

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className={`sidebar shadow ${isSidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-content px-3 py-3">
                    {/* New meeting btn */}
                    <div className="d-flex justify-content-center mb-3">
                        <button className="btn btn-new-meeting" onClick={handleNewMeetingClick}>+ New meeting</button>
                    </div>
                    {isFormOpen && (
                        <BookingForm
                            onClose={handleFormClose}
                            onSubmit={handleFormSubmit}
                        />
                    )}
                    {/* Calendar */}
                    <BasicDateCalendar />
                    <hr />
                    {/* Today's Meetings */}
                    <div className="mx-2 today-events"  style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between">
                            <h4>Today</h4>
                            <h4>{format(new Date(), 'dd/MM')}</h4>
                        </div>
                        {todayEvents.length > 0 ? (
                            todayEvents.map(event => (
                                <BookingItem key={event.id} event={event} />
                            ))
                        ) : (
                            <p>No meetings today</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Schedule */}
            <div className="main-content flex-grow-1 p-3">
                <div>
                    <ScheduleApp listEvent={events} /> {/* Truyền sự kiện vào ScheduleApp */}
                </div>
            </div>
        </div>
    );
};

export default Booking;
