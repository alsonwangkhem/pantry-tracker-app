import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { ChangeEvent, useState, useEffect } from 'react';
import { PantryItem } from '@/types';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import BasicDatePicker from '@/components/ExpirationDate';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface EditDialogProps {
  open: boolean;
  item: PantryItem | null;
  onClose: () => void;
  userId: string;
  fetchPantryItems: (userId: string) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, item, onClose, userId, fetchPantryItems }) => {
  const [editItem, setEditItem] = useState<PantryItem | null>(item);

  useEffect(() => {
    setEditItem(item); // Update the state when the item changes
  }, [item]);

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editItem) {
      setEditItem({ ...editItem, [e.target.name]: e.target.value });
    }
  };

  const handleEditDateChange = (date: Dayjs | null) => {
    if (editItem) {
      setEditItem({ ...editItem, expirationDate: date ? date.toDate() : undefined });
    }
  };

  const handleUpdateItem = async () => {
    if (editItem) {
      try {
        const itemRef = doc(db, 'pantry_items', editItem.id!);
        await updateDoc(itemRef, {
          name: editItem.name,
          quantity: editItem.quantity,
          expirationDate: editItem.expirationDate,
        });
        fetchPantryItems(userId);
        onClose();
      } catch (e) {
        console.error('Error updating item: ', e);
      }
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    handleEditDateChange(date);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the details of your pantry item.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          name="name"
          value={editItem?.name || ''}
          onChange={handleEditInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Quantity"
          name="quantity"
          value={editItem?.quantity || 0}
          onChange={handleEditInputChange}
          fullWidth
        />
        <BasicDatePicker
          selectedDate={editItem?.expirationDate ? dayjs(editItem.expirationDate) : undefined}
          // @ts-ignore
          setSelectedDate={handleDateChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdateItem} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
