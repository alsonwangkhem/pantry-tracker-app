import { Dayjs } from "dayjs";

export interface PantryItem {
    id?: string;          // Unique identifier for the pantry item
    name: string;        // Name of the pantry item
    quantity: number;    // Quantity of the item
    expirationDate?: Dayjs | Date; // Optional expiration date for the item
    userID: string;      // ID of the user who owns this item
  }