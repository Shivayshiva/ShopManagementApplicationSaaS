import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types (copied from CreateInvoicePage for consistency)
interface Product {
  id: string;
  type: string;
  serialNumber: string;
  quantity: number;
  rate: number;
  basePrice: number;
  discountAmount: number;
  discountPercentage: number;
  finalPrice: number;
  gstAmount: number;
  gstPercentage: number;
}

interface Invoice {
  id: string;
  customerName: string;
  customerMobile: string;
  customerDate: string | null;
  customerTime?: string;
  customerStatus: 'paid' | 'unpaid';
  customerAddress: string;
  createdAt: string;
  email: string;
  name: string;
  phone: string;
  status: string;
  totalOrders: number;
  totalSpent: number;
  updatedAt: string;
  products: Product[];
}

interface InvoiceState {
  invoices: Invoice[];
}

const initialState: InvoiceState = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    createInvoice: (state, action: PayloadAction<Invoice>) => {
      // Ensure invoices is always an array
      if (!Array.isArray(state.invoices)) {
        state.invoices = [];
      }
      state.invoices.push(action.payload);
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      // Ensure invoices is always an array
      if (!Array.isArray(state.invoices)) {
        state.invoices = [];
        return;
      }
      state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
    },
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      // Ensure invoices is always an array
      if (!Array.isArray(state.invoices)) {
        state.invoices = [];
        return;
      }
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    clearInvoices: (state) => {
      state.invoices = [];
    },
    resetInvoiceState: (state) => {
      // Reset to initial state
      state.invoices = [];
    },
  },
});

export const { createInvoice, deleteInvoice, setInvoices, updateInvoice, clearInvoices, resetInvoiceState } = invoiceSlice.actions;
export default invoiceSlice.reducer;

export type { Invoice, Product };
