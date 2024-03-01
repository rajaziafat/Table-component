import React, { useState, useMemo, useRef, useEffect } from 'react';
import data from '../data.json';
import { useTable, usePagination, useSortBy } from 'react-table';
import { FaAngleDown, FaAngleUp, FaArrowsAltV } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function EditTabel({ onSaveClick }) {
    const [searchTerms, setSearchTerms] = useState({});
    const [tableData, setTableData] = useState(data);
    const inputRefs = useRef({});

    const columns = useMemo(
        () =>
            Object.keys(data[0]).map(key => ({
                Header: key,
                accessor: key,
                Filter: ({ column }) => (
                    <input
                        type="search"
                        value={searchTerms[column.id] || ''}
                        onChange={e => {
                            const newSearchTerms = { ...searchTerms, [column.id]: e.target.value };
                            setSearchTerms(newSearchTerms);
                        }}
                        placeholder={`Search ${key}`}
                        className='bg-[#555] py-2 px-2 w-32 focus:outline-none font-[100]'
                        ref={el => (inputRefs.current[column.id] = el)}
                    />
                ),
            })),
        [searchTerms]
    );

    useEffect(() => {
        // Focus on the input field when it mounts or updates
        Object.keys(searchTerms).forEach(key => {
            const ref = inputRefs.current[key];
            if (ref && ref.focus) {
                ref.focus();
            }
        });
    }, [searchTerms]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy, // Place useSortBy first
        usePagination // Then place usePagination
    );

    const handleCellValueChange = (rowIndex, columnId, value) => {
        const newData = [...tableData];
        newData[rowIndex][columnId] = value;
        setTableData(newData);
    };

    return (
        <>
        <div className='flex justify-end pb-4 ' onClick={onSaveClick}>
                    <button className='px-4 py-2 bg-[#22c55e] text-white rounded-lg'>
                        Save
                    </button>
                </div>
            <div className='overflow-y-auto  overflow-x-auto'>
                
                <div className="  shadow-md sm:rounded-lg w-full h-[600px]">
                    <table {...getTableProps()} className="w-full text-sm text-left rtl:text-right bg-[#555] text-white ">
                        <thead className="text-xs text-white  bg-[#2c2c2c]">
                            {headerGroups.map(headerGroup => (
                                <tr  {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} className="px-2 pt-3 ">
                                            <div className="flex items-center justify-center">
                                                <span>{column.render('Header')}</span>
                                                {column.canSort && (
                                                    <div className="ml-1">
                                                        <button
                                                            onClick={() => column.toggleSortBy()}
                                                            className={`ml-1 focus:outline-none ${column.isSorted ? (column.isSortedDesc ? 'text-red-500' : 'text-green-500') : 'text-white'
                                                                }`}
                                                        >
                                                            {column.isSorted ? (column.isSortedDesc ? <FaAngleDown /> : <FaAngleUp />) : <FaArrowsAltV />}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                {headerGroups.map(headerGroup => (
                                    <React.Fragment key={headerGroup.id}>
                                        {headerGroup.headers.map(column => (
                                            <th key={column.id} className="px-2 py-2">
                                                <div>{column.render('Filter')}</div>
                                            </th>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="bg-[#444] border-b hover:bg-[#555]">
                                    {columns.map(column => (
                                        <td key={column.accessor} className="px-6 py-2">
                                            <input
                                                type="text"
                                                value={row[column.accessor]}
                                                onChange={e => handleCellValueChange(rowIndex, column.accessor, e.target.value)}
                                                className="bg-[#3c3c3c] px-2 border-none outline-none text-white w-24"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>


                        
                    </table>
                </div>
               

               
            </div>
        </>
    );
}

export default EditTabel;
