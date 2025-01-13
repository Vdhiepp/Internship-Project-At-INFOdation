import { useState } from "react";
import DeleteRoomModal from "../deleteRoomModal";
import EditRoomModal from "../editRoomModal";

const TableBody = ({ tableData, columns, onDelete }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditRoom = (roomId) => {
        // const roomToEdit = rooms.find(room => room.id === roomId);
        setSelectedRoom(roomId);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleSubmitRoom = (updatedRoom) => {
        setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
    };

    const handleDeleteClick = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    const handleDelete = (roomId) => {
        onDelete(roomId);
        setShowModal(false);
    };

    return (
        <tbody>
            {tableData.map((data) => {
                return (
                    <tr key={data.id}>
                        {columns.map(({ accessor }) => {
                            const tData = data[accessor] ? data[accessor] : "——";
                            return <td
                                key={accessor}
                                className={`${accessor === "name" || accessor === "description" ? "text-start" : "text-center"}`}
                            >{tData}</td>;
                        })}
                        <td>
                            {/* Render DeleteRoomModal when showModal is true */}
                            {showModal && (
                                <DeleteRoomModal
                                    room={selectedRoom}
                                    onDelete={handleDelete}
                                    onCancel={handleCancel}
                                />
                            )}
                            <button className="btn btn-action" onClick={() => handleDeleteClick(data)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                            {showEditModal && (
                                <EditRoomModal
                                    room={selectedRoom}
                                    onClose={handleCloseModal}
                                    onSubmit={handleSubmitRoom}
                                />
                            )}
                            <button className="btn btn-action ms-1" onClick={() => handleEditRoom(data.id)}>
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