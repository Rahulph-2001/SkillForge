import type React from 'react'

interface Column<T> {
    key: string
    header: string
    render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    keyExtractor: (item: T) => string | number
    onRowClick?: (item: T) => void
    emptyMessage?: string
}

export default function DataTable<T>({
    columns,
    data,
    keyExtractor,
    onRowClick,
    emptyMessage = 'No data available'
}: DataTableProps<T>) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={keyExtractor(item)}
                                    onClick={() => onRowClick?.(item)}
                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                        }`}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4">
                                            {column.render
                                                ? column.render(item)
                                                : String((item as any)[column.key] ?? '-')
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
