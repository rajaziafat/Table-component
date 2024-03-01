import React, { useState, useMemo, useRef, useEffect } from 'react';
import data from '../data.json';
import { useTable, usePagination, useSortBy } from 'react-table';
import { FaAngleDown, FaAngleUp, FaArrowsAltV } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


function Table({ onEditClick }) {
    const [searchTerms, setSearchTerms] = useState({});
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
    const filteredData = useMemo(() => {
        return data.filter(row => {
            return Object.keys(row).every(key => {
                const searchTerm = searchTerms[key];
                if (!searchTerm) return true;
                return String(row[key]).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerms]);

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
            data: filteredData,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy, // Place useSortBy first
        usePagination // Then place usePagination
    );


    return (
        <>
            <div className='overflow-x-auto overflow-y-auto '>

                <div className='flex justify-end pb-4 ' onClick={onEditClick}>

                    <button className='px-4 py-2 bg-[#22c55e] text-white rounded-lg'>
                        Edit
                    </button>
                </div>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-b scrollbar-track-gray-200 shadow-md sm:rounded-lg">
                    <table {...getTableProps()} className="w-full text-sm text-left rtl:text-right bg-[#555] text-white">
                        <thead className="text-xs text-white  bg-[#444]">
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
                        <tbody {...getTableBodyProps()}>
                            {page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} className="bg-[#2c2c2c] border-b hover:bg-[#555]">
                                        {row.cells.map(cell => {
                                            return <td {...cell.getCellProps()} className="px-6 py-2">{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* <div className="pagination flex items-center justify-end mt-4">
                    <div className="flex items-center text-white">

                        <button
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className="px-3 py-1 mr-2 bg-[#22c55e] text-white rounded"
                        >
                            <IoIosArrowBack />

                        </button>

                        <span className="mr-4">
                            Page{' '}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>
                        </span>
                        <button
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className="px-3 py-1 mr-2 bg-[#22c55e] text-white rounded"
                        >
                            <IoIosArrowForward />

                        </button>

                    </div>
                    <div>

                        <span className='text-white'>
                            | Jump to page:{' '}
                            <input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(page);
                                }}
                                className="px-2 py-1 rounded bg-[#444] border border-gray-300 focus:outline-none"
                                style={{ width: '100px' }}
                            />
                        </span>
                    </div>

                </div> */}



         
            </div>





        </>
    );
}

export default Table;
