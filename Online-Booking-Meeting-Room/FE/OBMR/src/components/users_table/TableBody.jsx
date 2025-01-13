const TableBody = ({ tableData, columns }) => {
    return (
        <tbody>
            {tableData.map((data, index) => (
                <tr key={data.id}>
                    <td className="text-center">{index + 1}</td>
                    {columns.map(({ accessor }) => {
                        let tData = data[accessor] ? data[accessor] : "——";

                        // Nếu dữ liệu là mảng (như authorities), nối các phần tử lại thành chuỗi
                        if (Array.isArray(tData)) {
                            tData = tData.join(", ");
                        }

                        // Nếu dữ liệu là chuỗi mật khẩu (hoặc chuỗi dài), rút ngắn lại
                        if (accessor === "password" && tData.length > 15) {
                            tData = tData.slice(0, 15) + "..."; // Cắt chuỗi và thêm ba chấm
                        }

                        // Đảm bảo rằng dữ liệu luôn hiển thị đúng loại (chuỗi, số, ngày tháng)
                        if (accessor === "createdAt" || accessor === "updatedAt") {
                            // Chuyển đổi ngày tháng sang định dạng dễ đọc nếu cần
                            const date = new Date(tData);
                            tData = date.toLocaleString();
                        }

                        return (
                            <td key={accessor} className="text-center">
                                {tData}
                            </td>
                        );
                    })}

                </tr>
            ))}
        </tbody>
    );
};

export default TableBody;
