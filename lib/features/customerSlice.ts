import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types for customer details
export interface Customer {
  id: string;
  customerName: string;
  customerMobile: string;
  customerDate: string | null;
  customerAddress: string;
  customerStatus: 'paid' | 'unpaid';
  createdAt: string;
  updatedAt: string;
  // Additional fields for compatibility with existing UI
  name?: string;
  email?: string;
  phone?: string;
  totalOrders?: number;
  totalSpent?: number;
  status?: 'active' | 'inactive';
  joinDate?: string;
  lastOrder?: string;
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    },
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
  },
});

export const { 
  addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  setSelectedCustomer, 
  setCustomers 
} = customerSlice.actions;

export default customerSlice.reducer;

export type { Customer, CustomerState }; 