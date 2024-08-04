"use client"
import { v4 as uuidv4 } from 'uuid';
import { auth, db } from "@/firebase";
import { Alert, Button, Paper, Snackbar, Table, TableContainer, TableHead, TableRow, TextField, TableBody, TableCell, IconButton, } from "@mui/material"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import QuantityInput from "@/components/NumberField";
import { ChangeEvent, useEffect, useState } from "react";
import BasicDatePicker from "@/components/ExpirationDate";
import { Dayjs } from "dayjs";
import { PantryItem } from "@/types";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import dayjs from 'dayjs';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DisplayPantries from '@/components/DisplayPantries';

// define collection name for the database
const PANTRY_COLLECTION = 'pantry_items';

function Dashboard() {
  const router = useRouter();

  const handleSignout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      router.push('.')
    }).catch((error) => {
      // An error happened.
    });
  }
  const [itemName, setItemName] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>();
  const [userId, setUserId] = useState<string>('');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchPantryItems(user.uid); // Fetch items after setting the userId
      } else {
        setUserId('');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPantryItems = async (userId: string) => {
    try {
      const q = query(collection(db, PANTRY_COLLECTION), where("userID", "==", userId));
      const querySnapshot = await getDocs(q);
      const items: PantryItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item: PantryItem = {
          id: doc.id,
          name: data.name,
          quantity: data.quantity,
          expirationDate: data.expirationDate ? new Date(data.expirationDate.seconds * 1000) : undefined, // Convert Firestore Timestamp to Date
          userID: data.userID
        };
        items.push(item);
      });
      setPantryItems(items);
    } catch (e) {
      console.error('Error fetching pantry items: ', e);
    }
  }

  const [open, setOpen] = useState(false);

  // add an item
  
  const addItem = async (item: PantryItem) => {
    try {
      const itemWithId: PantryItem = {...item, id: uuidv4()}
      const docRef = await addDoc(collection(db, PANTRY_COLLECTION), itemWithId);
      console.log("docRef created")
      return docRef.id;
    } catch (e) {
      console.error('Error adding item: ', e);
    }
  };
  const handleAddItem = async () => {
    console.log("handleAddItem triggered")
    const newItem: PantryItem = {
      name: itemName,
      quantity: quantity,
      expirationDate: selectedDate ? selectedDate.toDate() : undefined,
      userID: userId,
    };

    try {
      const itemId = await addItem(newItem);
      console.log('Item added with ID:', itemId);
      fetchPantryItems(userId); // Fetch items after adding a new one
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  return (
    <div className="h-screen">
      <div className="my-8 text-right mr-5 md:max-w-7xl"><Button variant="outlined" color="error" onClick={handleSignout}>Sign out</Button></div>
      <div className="my-8 text-center max-w-7xl flex flex-col space-y-4 md:flex-row items-center justify-center mx-auto space-x-6">
        <TextField id="standard-basic" label="Item name" variant="standard" value={itemName}
        onChange={(e) => setItemName(e.target.value)} />
        <QuantityInput quantity={quantity} setQuantity={setQuantity} ></QuantityInput>
        <BasicDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} ></BasicDatePicker>
        <Button onClick={handleAddItem}>
          <AddCircleIcon className="text-center h-[42px] w-[42px] cursor-pointer"/>
        </Button>
      </div>
      {/* main body */}
      <DisplayPantries pantryItems={pantryItems} fetchPantryItems={(userId: string) => fetchPantryItems(userId)} />
    </div>
  )
}

export default Dashboard
