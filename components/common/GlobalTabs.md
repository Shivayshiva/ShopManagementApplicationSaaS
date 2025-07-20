# GlobalTabs Component

A reusable tabs component that can be used throughout the application with customizable styling and content.

## Features

- ✅ Customizable tabs with icons
- ✅ Flexible styling options
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Easy to use API

## Basic Usage

```tsx
import GlobalTabs from '@/components/common/GlobalTabs';
import { Clock, CalendarIcon } from 'lucide-react';

const MyComponent = () => {
  return (
    <GlobalTabs
      defaultValue="today"
      tabs={[
        {
          value: "today",
          label: "Today's Attendance",
          icon: Clock,
          content: <div>Today's content</div>
        },
        {
          value: "history",
          label: "Attendance History",
          icon: CalendarIcon,
          content: <div>History content</div>
        }
      ]}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `string` | First tab value | The default active tab |
| `tabs` | `TabItem[]` | Required | Array of tab items |
| `className` | `string` | `"space-y-4"` | Main container className |
| `tabsListClassName` | `string` | `"grid w-full bg-gray-100 p-1 rounded-lg"` | TabsList container className |
| `tabsTriggerClassName` | `string` | Custom black theme | Individual tab trigger className |
| `tabsContentClassName` | `string` | `"space-y-4"` | Tab content container className |

## TabItem Interface

```tsx
interface TabItem {
  value: string;           // Unique identifier for the tab
  label: string;           // Display text for the tab
  icon?: LucideIcon;       // Optional icon component
  content: React.ReactNode; // Tab content
}
```

## Examples

### Basic Usage with Icons
```tsx
<GlobalTabs
  defaultValue="dashboard"
  tabs={[
    {
      value: "dashboard",
      label: "Dashboard",
      icon: Clock,
      content: <DashboardComponent />
    },
    {
      value: "analytics",
      label: "Analytics",
      icon: CalendarIcon,
      content: <AnalyticsComponent />
    }
  ]}
/>
```

### Custom Styling
```tsx
<GlobalTabs
  defaultValue="products"
  tabs={[...]}
  tabsListClassName="grid w-full grid-cols-3 bg-blue-100 p-1 rounded-lg"
  tabsTriggerClassName="bg-blue-600 text-white rounded-lg data-[state=active]:bg-blue-700"
/>
```

### Without Icons
```tsx
<GlobalTabs
  defaultValue="tab1"
  tabs={[
    {
      value: "tab1",
      label: "First Tab",
      content: <div>Content without icon</div>
    },
    {
      value: "tab2",
      label: "Second Tab",
      content: <div>Another content</div>
    }
  ]}
/>
```

## Migration from Direct Tabs Usage

### Before (Direct usage)
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="today" className="space-y-4">
  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
    <TabsTrigger value="today" className="...">
      <Clock className="w-4 h-4" />
      Today's Attendance
    </TabsTrigger>
    <TabsTrigger value="history" className="...">
      <CalendarIcon className="w-4 h-4" />
      Attendance History
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="today" className="space-y-4">
    <TodayContent />
  </TabsContent>
  
  <TabsContent value="history" className="space-y-4">
    <HistoryContent />
  </TabsContent>
</Tabs>
```

### After (GlobalTabs usage)
```tsx
import GlobalTabs from "@/components/common/GlobalTabs";

<GlobalTabs
  defaultValue="today"
  tabs={[
    {
      value: "today",
      label: "Today's Attendance",
      icon: Clock,
      content: <TodayContent />
    },
    {
      value: "history",
      label: "Attendance History",
      icon: CalendarIcon,
      content: <HistoryContent />
    }
  ]}
/>
```

## Benefits

1. **Consistency**: Ensures consistent tab styling across the application
2. **Reusability**: Easy to reuse in different parts of the app
3. **Maintainability**: Centralized styling and behavior
4. **Type Safety**: Full TypeScript support
5. **Flexibility**: Customizable styling and content
6. **Developer Experience**: Cleaner, more readable code 