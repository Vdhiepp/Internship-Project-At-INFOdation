import { useEffect, useState } from "react";
import RoomTable from "../../components/room_table/RoomTable";
import "../../styles/RoomController.css";
import AddRoomForm from "../../components/AddRoomForm";
import axios from "axios";

const RoomController = () => {
    const [isAddRoomVisible, setAddRoomVisible] = useState(false);
    const [roomData, setRoomData] = useState([]); // State để lưu danh sách phòng
    const [searchQuery, setSearchQuery] = useState(""); // State để lưu từ khóa tìm kiếm

    // Gọi API để lấy danh sách phòng
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/meeting-rooms")
            .then((response) => {
                console.log(response.data);
                setRoomData(response.data); // Lưu dữ liệu vào state
            })
            .catch((error) => {
                console.error("Error fetching room data:", error);
            });
    }, []);

    // Hàm tìm kiếm
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Cập nhật từ khóa tìm kiếm khi người dùng nhập
    };

    // Lọc dữ liệu phòng theo từ khóa tìm kiếm
    const filteredRoomData = roomData.filter(
        (room) =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Tìm kiếm theo tên phòng
            room.description.toLowerCase().includes(searchQuery.toLowerCase()) || // Tìm kiếm theo mô tả phòng
            room.capacity.toString().toLowerCase().includes(searchQuery.toLowerCase()) // Chuyển đổi capacity sang chuỗi trước khi tìm kiếm
    );

    const handleAddRoom = (newRoom) => {
        setRoomData((prevRooms) => [...prevRooms, newRoom]);
    };

    const handleEditRoom = async (updatedRoom) => {
        try {
            const response = await fetch(`http://localhost:8080/api/meeting-rooms/${updatedRoom.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRoom),
            });
            if (response.ok) {
                setRoomData((prevRooms) =>
                    prevRooms.map((room) =>
                        room.id === updatedRoom.id ? updatedRoom : room
                    )
                );
                Swal.fire({
                    title: "A room has been updated!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                console.log('Room updated successfully');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                });
                console.error('Failed to update room');
            }
        } catch (error) {
            console.error('Error during update:', error);
        }
    };

    // Handle deleting a room
    const handleDeleteRoom = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/meeting-rooms/${roomId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the room from the list
                setRoomData((prevRooms) => prevRooms.filter((room) => room.id !== roomId));

                // Hiển thị thông báo thành công
                Swal.fire({
                    title: "A room has been deleted!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                console.log(`Room with ID ${roomId} has been deleted.`);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!",
                });
                console.error(`Failed to delete room with ID ${roomId}.`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="px-3 py-3 room-page">
            <h4>Room Controller</h4>
            <div className="room-table p-3 shadow rounded">
                <div className="d-flex justify-content-between">
                    <div className="room-filter d-flex justify-content-start">
                        <input
                            id="searchRoom"
                            className="px-2 rounded ms-3 shadow search-input"
                            type="text"
                            placeholder="Search..."
                            value={searchQuery} // Liên kết với state
                            onChange={handleSearchChange} // Cập nhật state khi người dùng nhập
                        />

                    </div>
                    <button
                        id="addRoom"
                        className="btn btn-add-room shadow rounded me-3 px-4"
                        onClick={() => setAddRoomVisible(true)}
                    >
                        + Add New Room
                    </button>
                    {isAddRoomVisible && (
                        <AddRoomForm
                            onClose={() => setAddRoomVisible(false)}
                            onSubmit={handleAddRoom}
                        />
                    )}
                </div>
                <div className="p-3">
                    <RoomTable
                        roomData={filteredRoomData} // Truyền filteredRoomData thay vì roomData
                        onDelete={handleDeleteRoom}
                        onEdit={handleEditRoom}
                    />
                </div>
            </div>
        </div>
    );
};

export default RoomController;
