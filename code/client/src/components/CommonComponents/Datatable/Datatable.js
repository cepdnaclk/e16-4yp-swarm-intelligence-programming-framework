import React from 'react'
import DataTable, { createTheme } from 'react-data-table-component';

function Datatable(props) {

    const {data, columns} = props

    // custom theme
    createTheme('dark', {
        background: {
        default: 'transparent',
        },
    });

    //  custom styles
    const customStyles = {
        headCells: {
            style: {
                background: '#343d55'
            },
        },
        cells: {
            style: {
                background: '#283046'
            },
        }
    };

    return (
        <DataTable
            columns={columns}
            data={data}
            theme="dark"
            pagination
            pointerOnHover
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            customStyles={customStyles}
        />
    )
}

export default Datatable