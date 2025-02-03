import React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import AddTxnForm from "../add_transaction_screen/add_txn_screen"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { CurrencyBitcoin } from "@mui/icons-material"

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const history = useNavigate()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const mineBlock = async () => {
    try {
      const response = await axios.get("http://localhost:5000/mine_block")
      alert(`${response.data.message}\nRefresh Page to see new blocks!`)
      window.location.reload()
    } catch (error) {
      console.error("Error mining block:", error)
      alert("Failed to mine block. Try again later.")
    }
  }

  const pages = [
    { page: "Blockchain", func: () => window.location.reload() },
    { page: "Add Transaction", func: handleClickOpen },
    { page: "Mine New Block", func: mineBlock },
  ]

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #1a237e, #283593)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CurrencyBitcoin sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              fontWeight: "bold",
              color: "white",
              cursor: "pointer",
              display: { xs: "none", md: "flex" },
            }}
          >
            Amar's Blockchain
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" color="inherit" onClick={handleOpenNavMenu} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.page}
                  onClick={() => {
                    handleCloseNavMenu()
                    page.func()
                  }}
                >
                  <Typography textAlign="center">{page.page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <CurrencyBitcoin sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              display: { xs: "flex", md: "none" },
            }}
          >
            RabbittAI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "flex-end" }}>
            {pages.map((page) => (
              <Button
                key={page.page}
                onClick={page.func}
                sx={{
                  my: 2,
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                {page.page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
      <AddTxnForm open={open} handleClose={handleClose} />
    </AppBar>
  )
}

export default Header

