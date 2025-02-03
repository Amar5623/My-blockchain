import Box from "@mui/material/Box"
import { Card, CardContent, Grid, TextField, Typography, Chip, Button } from "@mui/material"
import { styled } from "@mui/system"

const StyledTextArea = styled("textarea")({
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "8px",
  fontFamily: "Roboto, sans-serif",
  fontSize: "14px",
  resize: "none",
  backgroundColor: "#f5f5f5",
})

export default function Block({ block, onViewDetails }) {
  return (
    <Box sx={{ minWidth: 375, padding: 2, width: "100%" }}>
      <Card
        sx={{ backgroundColor: "#ffffff", boxShadow: 3, borderRadius: 2, position: "relative", overflow: "visible" }}
      >
        <CardContent>
          <Chip
            label={`Block #${block.index}`}
            color="primary"
            sx={{
              position: "absolute",
              top: -12,
              left: 16,
              fontWeight: "bold",
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ mt: 2, color: "#1a237e" }}>
            Block Details
          </Typography>

          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#283593" }}>
                Timestamp:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={block.timestamp}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#283593" }}>
                Transactions:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2">{block.transactions.length} transaction(s)</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#283593" }}>
                Previous Hash:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={block.previous_hash}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#283593" }}>
                Hash:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField variant="outlined" size="small" fullWidth value={block.hash} InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="primary" onClick={() => onViewDetails(block)}>
              View Transactions
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

