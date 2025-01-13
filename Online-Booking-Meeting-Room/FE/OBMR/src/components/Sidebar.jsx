import React from "react";
import BasicDateCalendar from "./calender";
import BookingForm from "./BookingForm";
import BookingItem from "./BookingItem";
import { format } from "date-fns";

const Sidebar = ({ isOpen }) => {
    return (
        <div
            className={`sidebar shadow ${isOpen ? "open" : "closed"}`}
            style={{
                width: isOpen ? "250px" : "0",
                overflow: isOpen ? "visible" : "hidden",
                transition: "width 0.3s ease",
            }}
        >
            <div className="px-3 py-3">
                <div className="px-3 py-3">
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
                    <div className="mx-2">
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
        </div>
    );
};

export default Sidebar;
