import { useState } from "react";
import DeleteRoomModal from "../deleteRoomModal";
import EditRoomModal from "../editRoomModal";

const TableBody = ({ tableData, columns, onDelete, onEdit }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Hàm chỉnh sửa phòng
    const handleEditRoom = (roomId) => {
        setSelectedRoom(roomId);
        console.log(roomId);
        setShowEditModal(true);
    };

    // Đóng modal chỉnh sửa
    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    // Cập nhật phòng đã chỉnh sửa
    const handleSubmitRoom = (updatedRoom) => {
        onEdit(updatedRoom);  // Gọi hàm onEdit từ component cha
        setShowEditModal(false);
    };


    const handleDeleteClick = (roomId) => {
        setSelectedRoom(roomId);
        console.log(roomId);
        setShowDeleteModal(true);  // Sửa từ setShowModal thành setShowDeleteModal
    };

    // Hàm xóa phòng
    const handleDelete = (roomId) => {
        setShowDeleteModal(false);
        onDelete(roomId);  // Gọi onDelete từ prop

        // Đảm bảo đóng modal sau khi xóa
    };

    // Hủy thao tác xóa
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedRoom(null);
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
                                    className={`${accessor === "name" || accessor === "description" ? "text-start" : "text-center"}`}
                                >
                                    {tData}
                                </td>
                            );
                        })}
                        <td>
                            {/* Render DeleteRoomModal khi showDeleteModal là true */}
                            {showDeleteModal && selectedRoom && (
                                <DeleteRoomModal
                                    room={selectedRoom}
                                    onDelete={handleDelete}
                                    onCancel={handleCancelDelete}
                                />
                            )}
                            <button className="btn btn-action" onClick={() => handleDeleteClick(data.id)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>

                            {/* Render EditRoomModal khi showEditModal là true */}
                            {showEditModal && selectedRoom && (
                                <EditRoomModal
                                    room={selectedRoom}
                                    onClose={handleCloseModal}
                                    onSubmit={handleSubmitRoom}
                                />
                            )}
                            <button className="btn btn-action ms-1" onClick={() => handleEditRoom(data)}>
                                <i className="fa-solid fa-pen"></i>
                            </button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
};

export default TableBody;
