import { ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/CommonCard"

interface StatCardProps {
  title: string
  icon: ReactNode
  value: string | number
  description: string
  iconClassName?: string
}

export default function StatCard({ title, icon, value, description, iconClassName }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={iconClassName}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
} 