import { useState } from "react";
import DeleteEventModal from "../deleteEventModal";  // Modal xóa sự kiện
import EditEventModal from "../editEventModal";      // Modal chỉnh sửa sự kiện
import { format } from "date-fns";

const TableBody = ({ tableData, columns, onDelete, onEdit }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Hàm chỉnh sửa sự kiện
    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        console.log(event);
        setShowEditModal(true);
    };

    // Đóng modal chỉnh sửa
    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    // Cập nhật sự kiện đã chỉnh sửa
    const handleSubmitEvent = (updatedEvent) => {
        onEdit(updatedEvent);  // Gọi hàm onEdit từ component cha
        setShowEditModal(false);
    };

    const handleDeleteClick = (eventId) => {
        setSelectedEvent(eventId);
        console.log(eventId);
        setShowDeleteModal(true);  // Mở modal xóa
    };

    // Hàm xóa sự kiện
    const handleDelete = (eventId) => {
        setShowDeleteModal(false);
        onDelete(eventId);  // Gọi onDelete từ prop
    };

    // Hủy thao tác xóa
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedEvent(null);
    };

    return (
        <tbody>
            {tableData.map((data, index) => {
                return (
                    <tr key={data.id}>
                        <td className="text-center">{index + 1}</td>
                        {columns.map(({ accessor }) => {
                            const tData = data[accessor] ? data[accessor] : "——";
                            return (
                                <td
                                    key={accessor}
                                    className={`${accessor === "title" || accessor === "description" ? "text-start" : "text-center"}`}
                                >
                                    {accessor === "startTime" || accessor === "endTime"
                                        ? format(new Date(data[accessor]), "dd/MM/yyyy HH:mm")  // Format ngày giờ
                                        : accessor === "location"
                                        ? data.meetingRoom?.name
                                        : tData
                                    }
                                    
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;
