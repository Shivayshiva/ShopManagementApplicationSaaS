import React from 'react';
import { Clock, CalendarIcon, Settings, Users, Package, Store } from 'lucide-react';
import GlobalTabs from './GlobalTabs';

// Example 1: Basic usage with icons
export const BasicTabsExample = () => {
  return (
    <GlobalTabs
      defaultValue="dashboard"
      tabs={[
        {
          value: "dashboard",
          label: "Dashboard",
          icon: Clock,
          content: <div>Dashboard content goes here</div>
        },
        {
          value: "analytics",
          label: "Analytics",
          icon: CalendarIcon,
          content: <div>Analytics content goes here</div>
        },
        {
          value: "settings",
          label: "Settings",
          icon: Settings,
          content: <div>Settings content goes here</div>
        }
      ]}
    />
  );
};

// Example 2: Custom styling
export const CustomStyledTabsExample = () => {
  return (
    <GlobalTabs
      defaultValue="products"
      tabs={[
        {
          value: "products",
          label: "Products",
          icon: Package,
          content: <div>Products management</div>
        },
        {
          value: "customers",
          label: "Customers",
          icon: Users,
          content: <div>Customer management</div>
        },
        {
          value: "shop",
          label: "Shop",
          icon: Store,
          content: <div>Shop display</div>
        }
      ]}
      tabsListClassName="grid w-full grid-cols-3 bg-blue-100 p-1 rounded-lg"
      tabsTriggerClassName="bg-blue-600 text-white rounded-lg data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-blue-600 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2"
    />
  );
};

// Example 3: Without icons
export const TabsWithoutIconsExample = () => {
  return (
    <GlobalTabs
      defaultValue="tab1"
      tabs={[
        {
          value: "tab1",
          label: "First Tab",
          content: <div>First tab content</div>
        },
        {
          value: "tab2",
          label: "Second Tab",
          content: <div>Second tab content</div>
        },
        {
          value: "tab3",
          label: "Third Tab",
          content: <div>Third tab content</div>
        }
      ]}
    />
  );
};

// Example 4: Complex content with components
export const ComplexTabsExample = () => {
  const ProductList = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Product List</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">Product 1</div>
        <div className="p-4 border rounded-lg">Product 2</div>
        <div className="p-4 border rounded-lg">Product 3</div>
      </div>
    </div>
  );

  const CustomerList = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Customer List</h3>
      <div className="space-y-2">
        <div className="p-3 border rounded-lg">Customer 1</div>
        <div className="p-3 border rounded-lg">Customer 2</div>
        <div className="p-3 border rounded-lg">Customer 3</div>
      </div>
    </div>
  );

  return (
    <GlobalTabs
      defaultValue="products"
      tabs={[
        {
          value: "products",
          label: "Products",
          icon: Package,
          content: <ProductList />
        },
        {
          value: "customers",
          label: "Customers",
          icon: Users,
          content: <CustomerList />
        }
      ]}
    />
  );
}; 