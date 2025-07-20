import type { Customer } from './features/customerSlice';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomerApiResponse extends ApiResponse<Customer[]> {}
export interface SingleCustomerApiResponse extends ApiResponse<Customer> {}

// Staff interfaces
export interface Staff {
  _id?: string;
  name: string;
  email?: string;
  phone: string;
  familyPhone?: string;
  role: string;
  isActive: boolean;
  category: 'Type 1' | 'Type 2' | 'Type 3' | 'Type 4';
  address?: string;
  joiningDate: Date;
  attendance?: any[];
  totalSales?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StaffApiResponse extends ApiResponse<Staff[]> {}
export interface SingleStaffApiResponse extends ApiResponse<Staff> {}

// Base API client with error handling
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Customer API methods
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<CustomerApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/customers${queryString ? `?${queryString}` : ''}`;
    
    return this.request<CustomerApiResponse>(endpoint);
  }

  async getCustomerById(id: string): Promise<SingleCustomerApiResponse> {
    return this.request<SingleCustomerApiResponse>(`/api/customers/${id}`);
  }

  async createCustomer(customerData: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    totalVisitCount?: number;
    groupType?: string;
    notes?: string;
  }): Promise<SingleCustomerApiResponse> {
    return this.request<SingleCustomerApiResponse>('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(
    id: string,
    customerData: Partial<{
      name: string;
      email: string;
      phone: string;
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      totalVisitCount: number;
      groupType: string;
      notes: string;
      isActive: boolean;
    }>
  ): Promise<SingleCustomerApiResponse> {
    return this.request<SingleCustomerApiResponse>(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Staff API methods
  async getStaff(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    category?: string;
  }): Promise<StaffApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params?.category) searchParams.append('category', params.category);

    const queryString = searchParams.toString();
    const endpoint = `/api/staff${queryString ? `?${queryString}` : ''}`;
    
    return this.request<StaffApiResponse>(endpoint);
  }

  async getStaffById(id: string): Promise<SingleStaffApiResponse> {
    return this.request<SingleStaffApiResponse>(`/api/staff/${id}`);
  }

  async createStaff(staffData: {
    name: string;
    email?: string;
    phone: string;
    familyPhone?: string;
    role: string;
    category: 'Type 1' | 'Type 2' | 'Type 3' | 'Type 4';
    address?: string;
    joiningDate: Date;
    isActive?: boolean;
  }): Promise<SingleStaffApiResponse> {
    return this.request<SingleStaffApiResponse>('/api/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  async updateStaff(
    id: string,
    staffData: Partial<{
      name: string;
      email: string;
      phone: string;
      familyPhone: string;
      role: string;
      isActive: boolean;
      category: 'Type 1' | 'Type 2' | 'Type 3' | 'Type 4';
      address: string;
      joiningDate: Date;
    }>
  ): Promise<SingleStaffApiResponse> {
    return this.request<SingleStaffApiResponse>(`/api/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  }

  async deleteStaff(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/api/staff/${id}`, {
      method: 'DELETE',
    });
  }

  async patchStaffAttendance(
    id: string,
    attendanceData: {
      date: string;
      clockingTime: string;
      status: string;
    }
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/api/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(attendanceData),
    });
  }

  // Invoice API methods
  async addInvoice(invoiceData: any): Promise<ApiResponse> {
    return this.request<ApiResponse>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async getInvoices(params?: { page?: number; limit?: number; search?: string; }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    const queryString = searchParams.toString();
    const endpoint = `/api/invoices${queryString ? `?${queryString}` : ''}`;
    return this.request<ApiResponse>(endpoint);
  }

  // Product API methods
  async deleteProductImage(productId: string, imageUrl: string): Promise<ApiResponse<{ images: string[] }>> {
    return this.request<ApiResponse<{ images: string[] }>>('/api/products/deleteImage', {
      method: 'DELETE',
      body: JSON.stringify({ productId, imageUrl }),
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

export const addInvoice = apiClient.addInvoice.bind(apiClient);
export const getInvoices = apiClient.getInvoices.bind(apiClient);

// Export individual functions for convenience
export const customerApi = {
  getAll: (params?: Parameters<ApiClient['getCustomers']>[0]) => apiClient.getCustomers(params),
  getById: (id: string) => apiClient.getCustomerById(id),
  create: (data: Parameters<ApiClient['createCustomer']>[0]) => apiClient.createCustomer(data),
  update: (id: string, data: Parameters<ApiClient['updateCustomer']>[1]) => apiClient.updateCustomer(id, data),
  delete: (id: string) => apiClient.deleteCustomer(id),
};

export const staffApi = {
  getAll: (params?: Parameters<ApiClient['getStaff']>[0]) => apiClient.getStaff(params),
  getById: (id: string) => apiClient.getStaffById(id),
  create: (data: Parameters<ApiClient['createStaff']>[0]) => apiClient.createStaff(data),
  update: (id: string, data: Parameters<ApiClient['updateStaff']>[1]) => apiClient.updateStaff(id, data),
  delete: (id: string) => apiClient.deleteStaff(id),
  patchAttendance: (id: string, data: Parameters<ApiClient['patchStaffAttendance']>[1]) => apiClient.patchStaffAttendance(id, data),
};

export const productApi = {
  deleteImage: (productId: string, imageUrl: string) => apiClient.deleteProductImage(productId, imageUrl),
}; 