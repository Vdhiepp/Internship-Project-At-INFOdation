import UserTable from "../../components/users_table/UsersTable";
import "../../styles/RoomController.css"
import { useEffect, useState } from 'react';
import axios from 'axios';
const UserController = () => {
    const [users, setUsers] = useState([]); // State để lưu danh sách người dùng
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi nếu có

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Gửi request GET đến API để lấy danh sách người dùng
                const response = await axios.get('http://localhost:8080/api/app-users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('id_token')}`, // Nếu cần token
                    },
                });

                // Lưu danh sách người dùng vào state
                setUsers(response.data);
                setLoading(false); // Đặt lại trạng thái tải khi dữ liệu đã được lấy
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // useEffect chạy chỉ một lần khi component được mount

    if (loading) {
        return <div style={{ height: "calc(100vh - 70px - 40px)" }}>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }

    if (error) {
        return <div>{error}</div>; // Hiển thị lỗi nếu có
    }
    return (
        <div className="px-3 py-3 room-page">
            <h4>User Controller</h4>
            <div className="room-table p-3 shadow rounded">
                <div className="room-filter d-flex justify-content-start">

                    {/* <input className="px-2 rounded ms-3 shadow search-input" type="text" placeholder="Search..."/> */}
                    {/* <button className="btn btn-search shadow rounded ms-2">Seach</button> */}
                </div>
                <div className="p-3">
                    <UserTable />

                </div>
            </div>
        </div>
    );
}



export default UserController;

