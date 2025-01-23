import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function AddTxnScreen({ open, handleClose }) {
    const [state, setState] = useState({
        sender: "",
        receiver: "",
        amount: "",
    });

    const [error, setError] = useState("");

    const validateForm = () => {
        if (!state.sender || !state.receiver || !state.amount) {
            return "All fields are required";
        }
        if (isNaN(state.amount) || Number(state.amount) <= 0) {
            return "Amount must be a number greater than 0";
        }
        return "";
    };

    const handleSubmit = async () => {
        const errorMessage = validateForm();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/add_transaction', state);
            alert(response.data.message);
            handleClose();
            setState({ sender: "", receiver: "", amount: "" });
        } catch (err) {
            console.error(err);
            alert("Transaction Failed.");
        }
    };

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
        setError("");
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                Send Crypto Coins
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ textAlign: "center", marginBottom: 2 }}>
                    Please enter transaction details carefully.
                </DialogContentText>
                {error && (
                    <Box sx={{ marginBottom: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
                <TextField
                    autoFocus
                    margin="dense"
                    name="sender"
                    label="Sender Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={state.sender}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="receiver"
                    label="Receiver Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={state.receiver}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={state.amount}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
                <Button onClick={handleClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: "#2196f3",
                        "&:hover": {
                            backgroundColor: "#1769aa",
                        },
                    }}
                >
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
}
