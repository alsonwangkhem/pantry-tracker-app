import { PantryItem } from "@/types"
import dayjs, { Dayjs } from 'dayjs';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Paper, Table, TableContainer, TableHead, TableRow, TableBody, TableCell, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, } from "@mui/material"
import { useState } from "react";
import { db } from "@/firebase";
import { PANTRY_COLLECTION } from "@/app/dashboard/page";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";


function DisplayPantries({ pantryItems, fetchPantryItems }: { pantryItems: PantryItem[], fetchPantryItems: (userId: string) => void }) {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
    const handleClickOpen = (item: PantryItem) => {
        setSelectedItem(item);
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    }
    const handleSave = async () => {
        // handle save logic here
        if (selectedItem && selectedItem.id) {
            const updatedItem = {
              ...selectedItem,
              expirationDate: selectedItem.expirationDate instanceof Date ? selectedItem.expirationDate : dayjs(selectedItem.expirationDate).toDate(),
            };
      
            try {
              const itemDoc = doc(db, PANTRY_COLLECTION, selectedItem.id);
              await updateDoc(itemDoc, updatedItem);
              console.log('Item updated with ID:', selectedItem.id);
              fetchPantryItems(selectedItem.userID); // Fetch items after updating
            } catch (error) {
              console.error('Error updating item:', error);
            }
          }
        setOpen(false);
    }
    const handleDelete = async (item: PantryItem) => {
        if (item.id) {
            try {
                const itemDoc = doc(db, PANTRY_COLLECTION, item.id);
                await deleteDoc(itemDoc);
                console.log(`Item deleted with ID: `, item.id);
                fetchPantryItems(item.userID);
            } catch(error) {
                console.log(`Error deleting item: `, error);
            }
        }
    }
  return (
    <div>
        <TableContainer component={Paper} elevation={24} className="flex flex-col items-center h-[70%] w-[60%] mx-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className='font-bold'>Name</TableCell>
                  <TableCell className='font-bold'>Quantity</TableCell>
                  <TableCell className='font-bold'>Expiration Date</TableCell>
                  <TableCell className='font-bold'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pantryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='capitalize'>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.expirationDate ? dayjs(item.expirationDate).format('DD-MM-YYYY') : 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleClickOpen(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    value={selectedItem?.name || ''}
                    onChange={(e) => setSelectedItem((prev) => prev ? {...prev, name: e.target.value}: null)}
                    />
                    <TextField
                    margin="dense"
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={selectedItem?.quantity || ''}
                    onChange={(e) => setSelectedItem((prev) => prev ? { ...prev, quantity: parseInt(e.target.value) } : null)}
                    />
                    <TextField
                    margin="dense"
                    label="Expiration Date"
                    type="date"
                    fullWidth
                    value={selectedItem?.expirationDate ? dayjs(selectedItem.expirationDate).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setSelectedItem((prev) => prev ? { ...prev, expirationDate: dayjs(e.target.value) as unknown as Dayjs } : null)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
          </Dialog>
    </div>
  )
}

export default DisplayPantries