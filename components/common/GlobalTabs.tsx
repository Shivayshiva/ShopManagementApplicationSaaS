import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

interface GlobalTabsProps {
  defaultValue?: string;
  tabs: TabItem[];
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
}

const GlobalTabs: React.FC<GlobalTabsProps> = ({
  defaultValue,
  tabs,
  className = "space-y-4",
  tabsListClassName = "grid w-full bg-gray-100 p-1 rounded-lg",
  tabsTriggerClassName = "bg-black text-white rounded-lg data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2",
  tabsContentClassName = "space-y-4"
}) => {
  // Set default value to first tab if not provided
  const defaultTabValue = defaultValue || tabs[0]?.value || "";

  return (
    <Tabs defaultValue={defaultTabValue} className={className}>
      <TabsList className={tabsListClassName} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={tabsTriggerClassName}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={tabsContentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default GlobalTabs; 