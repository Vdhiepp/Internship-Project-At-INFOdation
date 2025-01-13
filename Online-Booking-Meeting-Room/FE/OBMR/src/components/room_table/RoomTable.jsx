import { useState } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import RoomData from "./../../data/RoomData.json";
import { Pagination } from "antd";

const RoomTable = ({ roomData, onDelete, onEdit }) => {
    const [tableData] = useState(RoomData); // Dữ liệu gốc
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(5); // Số dòng mỗi trang

    // Dữ liệu phân trang
    const paginatedData = roomData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    // Xử lý thay đổi trang/kích thước
    const handlePaginationChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };
    const handleDelete = (roomId) => {
        onDelete(roomId);  // Gọi hàm onDelete từ RoomController
        setShowDeleteModal(false);
    };


    const handleEditRoom = (updatedRoom) => {
        onEdit(updatedRoom);
        console.log("Room to edit:", updatedRoom);
        // Logic chỉnh sửa phòng
    };

    // const [tableData, setTableData] = useState(RoomData);

    const columns = [
        // { label: "#", accessor: "id" },
        { label: "Name", accessor: "name" },
        { label: "Description", accessor: "description" },
        { label: "Capacity", accessor: "capacity" },
        // { label: "Status", accessor: "status" },
    ];

    return (
        <>
            <div style={{
                minHeight: "calc(100vh - 320px)",
                maxHeight: "calc(100vh - 320px)",
                overflowY: "auto"
            }}>


                <table className="table">

                    <TableHead columns={[...columns, { label: "Actions", accessor: "actions" }]} />
                    <TableBody columns={columns}
                        tableData={paginatedData}
                        onDelete={handleDelete}
                        onEdit={handleEditRoom} />
                </table> </div>
            <Pagination
                total={roomData.length}
                current={currentPage}
                pageSize={pageSize}
                pageSizeOptions={["5", "10", "20", "50"]}
                showSizeChanger
                showQuickJumper
                onChange={handlePaginationChange}
                showTotal={(total) => `Total ${total} items`}
            // style={{ marginTop: "20px", textAlign: "right" }}
            />
        </>
    );
};

export default RoomTable;