const TableHead = ({ columns }) => {
    return (
        <thead>
            <tr>
                <th className="text-center">#</th>
                {columns.map(({ label, accessor }) => {
                    return <th
                        key={accessor}
                        className={`${accessor === "name" || accessor === "description" ? "text-start" : "text-center"}`}
                    >
                        {label}
                    </th>;
                })}
            </tr>
        </thead>
    );
};

export default TableHead;