import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";


const AdminHeader = ({ toggleSidebar }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const idToken = localStorage.getItem('id_token'); // Hoặc nơi bạn lưu id_token
        if (idToken) {
            try {
                const decodedToken = jwtDecode(idToken);
                setUsername(decodedToken.sub || decodedToken.name || 'User'); // Tùy thuộc vào cấu trúc token
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        const isConfirmed = window.confirm("Are you sure you want to log out?");
        if (isConfirmed) {
            localStorage.removeItem('id_token'); // Xóa token khỏi localStorage
            window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
        }

    };

    return (
        <header className="app-header d-flex justify-content-between align-items-center text-white px-3 py-2">
            <div className='d-flex justify-content-start align-items-center'>
                <button className="btn btn-menu" onClick={toggleSidebar}>
                    <i className="fa fa-list"></i>
                </button>
                <h3 className='m-0 ms-4'>ADMIN</h3>
            </div>
            <div className="d-flex align-items-center">
                <div className='d-flex align-items-center me-5'>
                    <img
                        src="/src/assets/avatar.png" // Đường dẫn tương đối đến thư mục assets
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px' }}
                    />
                    <span className="ms-3">{username}</span>
                </div>
                <button className="btn btn-noti" onClick={handleLogout}>
                    <i className="fa fa-sign-out-alt"></i>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
