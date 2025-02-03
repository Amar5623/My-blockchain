import { Container, Grid, Typography, Box } from "@mui/material"
import { makeStyles } from "@mui/styles"
import React, { useEffect, useState } from "react"
import Header from "../header/header"
import Block from "./block"
import Chain from "./link"
import TransactionDetails from "./transaction_details"

const useStyle = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },
  blockchain: {
    padding: 5,
  },
}))

function BlockChainScreen() {
  const classes = useStyle()
  const [blocks, setBlocks] = useState([])
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [openTransactions, setOpenTransactions] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/get_chain")
      const result = await response.json()
      if (result) setBlocks(result.chain)
    }
    fetchData()
  }, [])

  const handleViewDetails = (block) => {
    setSelectedBlock(block)
    setOpenTransactions(true)
  }

  const handleCloseTransactions = () => {
    setOpenTransactions(false)
  }

  return (
    <Box className={`${classes.root} blockchain-bg`}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#1a237e", fontWeight: "bold", textAlign: "center" }}>
          Blockchain Explorer
        </Typography>
        <Grid className={classes.blockchain} container spacing={3} alignItems="center" justifyContent="center">
          {blocks.map((block, index) => (
            <React.Fragment key={block.index}>
              <Grid item xs={12}>
                <Block block={block} onViewDetails={handleViewDetails} />
              </Grid>
              {index < blocks.length - 1 && (
                <Grid item xs={12}>
                  <Chain />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Container>
      {selectedBlock && (
        <TransactionDetails
          open={openTransactions}
          handleClose={handleCloseTransactions}
          transactions={selectedBlock.transactions}
        />
      )}
    </Box>
  )
}

export default BlockChainScreen
