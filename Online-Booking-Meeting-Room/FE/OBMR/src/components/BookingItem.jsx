import React from 'react';
import { format } from 'date-fns';
import { calendars } from '../data/calendarData'; // Đảm bảo rằng bạn đã import đúng `calendars`

const BookingItem = ({ event }) => {
  // Lấy màu từ calendar dựa trên calendarId của sự kiện
  const calendar = calendars[event.calendarId] || calendars['default'];

  // Sử dụng màu sắc từ calendar
  const colors = calendar.lightColors || {};

  return (
    <div
      className="d-flex justify-content-between align-items-center p-2 mt-2 rounded"
      style={{
        backgroundColor: colors.container,
        color: colors.onContainer,
        borderLeft: `3px solid ${colors.main}` // Thêm viền trái sử dụng màu từ darkColors
      }}
    >
      <span className="fw-bold" style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
        maxWidth: '110px' // Thay đổi chiều rộng phù hợp
      }}>{event.title}</span>
      <span style={{ fontSize: '0.8rem' }} className="fw-light ms-2">{format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}</span>
    </div>
  );
};

export default BookingItem;
