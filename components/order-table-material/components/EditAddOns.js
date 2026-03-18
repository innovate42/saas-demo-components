// EditAddOns.js (updated)
import * as React from 'react'
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Typography, Box, Stack, Paper } from '@mui/material'

const EditAddOns = ({ addOns, reviewChangesLink, nextSchedule, subscription, setEditAddOns }) => {
  const [selectedAddOns, setSelectedAddOns] = React.useState([])

  const handleCheckboxChange = (id, checked) => {
    setSelectedAddOns((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  const cancelChanges = () => {
    setSelectedAddOns([])
    setEditAddOns(false)
  }

  const handleRemoveSelected = () => {
    const req = requestBodyBuilder()
    console.log(req)
    // window.location.href = reviewChangesLink + "?remove_addons=" + selectedAddOns.join("|")
  }

  const requestBodyBuilder = () => {
    const effectiveDate = nextSchedule?.data?.date || new Date()
    const removeList = selectedAddOns.map((id) => ({
      type: 'remove',
      quantity: '1',
      id,
      effective_date: effectiveDate
    }))
    return {
      order_type: 'update_subscription',
      forSubscription: { name: subscription.name },
      updates: removeList,
      owner: subscription.owner,
      external_id: 'string',
      source: 'online',
      process_immediately: true
    }
  }

  return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Edit Add-ons</Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Add-On</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addOns.map((addOn) => (
                <TableRow key={addOn.id}>
                  <TableCell>
                    <Checkbox
                        checked={selectedAddOns.includes(addOn.id)}
                        onChange={(e) => handleCheckboxChange(addOn.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{addOn.name}</TableCell>
                  <TableCell>{addOn.data.price__limio?.[0]?.amount || 'N/A'}</TableCell>
                  <TableCell>{addOn.data.attributes.description__limio}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleRemoveSelected}>
            Review Changes
          </Button>
          <Button variant="outlined" onClick={cancelChanges}>
            Cancel Changes
          </Button>
        </Stack>
      </Paper>
  )
}

export default EditAddOns
