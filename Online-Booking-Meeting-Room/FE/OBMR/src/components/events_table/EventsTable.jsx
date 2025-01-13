import { useState } from "react";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
// import EventData from "./../../data/EventData.json";  // Dữ liệu sự kiện (tạo file EventData.json hoặc lấy từ API)
import { Pagination } from "antd";

const EventTable = ({ eventData, onDelete, onEdit }) => {
    // const [tableData] = useState(EventData); // Dữ liệu gốc
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [pageSize, setPageSize] = useState(5); // Số dòng mỗi trang

    // Dữ liệu phân trang
    const paginatedData = eventData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    // Xử lý thay đổi trang/kích thước
    const handlePaginationChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const handleDelete = (eventId) => {
        onDelete(eventId);  // Gọi hàm onDelete từ EventController
        setShowDeleteModal(false);
    };

    const handleEditEvent = (updatedEvent) => {
        onEdit(updatedEvent);
        console.log("Event to edit:", updatedEvent);
        // Logic chỉnh sửa sự kiện
    };

    const columns = [
        { label: "Title", accessor: "title" },
        { label: "Description", accessor: "description" },
        { label: "Location", accessor: "location" },
        { label: "Start", accessor: "startTime" },
        { label: "End", accessor: "endTime" },
        // Bạn có thể thêm các cột khác nếu cần
    ];

    return (
        <>
            <div style={{
                minHeight: "calc(100vh - 320px)",
                maxHeight: "calc(100vh - 320px)",
                overflowY: "auto"
            }}>
                <table className="table">
                    <TableHead columns={[...columns]} />
                    <TableBody columns={columns}
                        tableData={paginatedData}
                        onDelete={handleDelete}
                        onEdit={handleEditEvent} />
                </table>
            </div>
            <Pagination
                total={eventData.length}
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

export default EventTable;
