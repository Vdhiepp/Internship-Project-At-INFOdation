const TableHead = ({ columns }) => {
    return (
        <thead>
            <tr>
                <th className="text-center">#</th>
                {columns.map((column) => (
                    <th key={column.accessor} className="text-center">
                        {column.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHead;
