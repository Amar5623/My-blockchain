import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@mui/material"
  
  export default function TransactionDetails({ open, handleClose, transactions }) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="transaction table">
              <TableHead>
                <TableRow>
                  <TableCell>Sender</TableCell>
                  <TableCell>Receiver</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {transaction.sender}
                    </TableCell>
                    <TableCell>{transaction.receiver}</TableCell>
                    <TableCell align="right">{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
  
  