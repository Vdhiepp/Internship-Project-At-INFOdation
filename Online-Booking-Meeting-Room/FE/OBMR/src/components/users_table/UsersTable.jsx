import { useEffect, useState } from "react";
import axios from "axios";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import { Pagination } from "antd";

const RoomTable = () => {
    const [users, setUsers] = useState([]); // Dữ liệu người dùng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(5); // Số dòng mỗi trang
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Trạng thái lỗi

    // Lấy dữ liệu người dùng từ API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/app-users", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("id_token")}`, // Nếu cần token
                    },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch users");
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Dữ liệu phân trang
    const paginatedData = users.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Xử lý thay đổi trang/kích thước
    const handlePaginationChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    // Các cột cho bảng
    const columns = [
        // { label: "#", accessor: "id" },
        { label: "Username", accessor: "username" },
        { label: "Email", accessor: "email" },
        { label: "PhoneNumber", accessor: "phoneNumber" },
        { label: "Created at", accessor: "createdAt" },
        { label: "Updated at", accessor: "updatedAt" },

    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div
                style={{
                    minHeight: "calc(100vh - 285px)",
                    maxHeight: "calc(100vh - 285px)",
                    overflowY: "auto",
                }}
            >
                <table className="table">
                    <TableHead columns={[...columns]} />
                    <TableBody columns={columns} tableData={paginatedData} />
                </table>
            </div>
            <Pagination
                total={users.length}
                current={currentPage}
                pageSize={pageSize}
                pageSizeOptions={["5", "10", "20", "50"]}
                showSizeChanger
                showQuickJumper
                onChange={handlePaginationChange}
                showTotal={(total) => `Total ${total} items`}
            />
        </>
    );
};

export default RoomTable;
