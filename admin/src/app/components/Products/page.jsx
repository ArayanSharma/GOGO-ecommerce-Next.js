import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const page = () => {

    const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = [];

  const columns = [
  { id: 'Id', label: 'ID', minWidth: 90 },
  { id: 'Product', label: 'Product', minWidth: 300 },
  { id: 'Category', label: 'Category', minWidth: 100 },
  { id: 'Price', label: 'Price', minWidth: 100 },
  { id: 'Sales', label: 'Sales', minWidth: 100 },
  { id: 'stock', label: 'Stock', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

  return (
    <div>
      <section className='w-full py-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-red-800'>Products</h2>
          <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>Add Product</button>



        </div>

        <div className='mt-6'>
            <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
     
        </div>


      </section>
     
      
    </div>
  )
}

export default page

