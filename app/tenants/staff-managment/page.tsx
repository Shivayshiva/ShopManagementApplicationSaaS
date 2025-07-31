"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Clock, CalendarIcon, Search, Users, CheckCircle, XCircle, Timer, Download, Plus } from "lucide-react"
import GlobalTabs from "@/components/common/GlobalTabs"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Title from "@/components/common/Title"
import StaffAttendanceDialog from "@/components/staffAttendanceDialog"
import GlobalButton from "@/components/common/globalButton"
import StatCard from "@/components/common/StatCard"
import { AddStaffDialog } from "@/components/common/AddStaffDialog"
import GlobalTable from "@/components/common/GlobalTable"
import AttendanceHistoryStaff from "@/components/attendanceHistoryStaff"
import TodayAttendanceTable from "@/components/todayAttendaceTableStaff"
import FilterSectionStaffTable from "@/components/filterSectionStaffTable"



export default function StaffAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false)

  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  })




  return (
    <div className="space-y-4 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <Title 
            title="Staff Attendance"
            subtitle={`Today, ${format(new Date(), "EEEE, MMMM d, yyyy")} • ${currentTime}`}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <AddStaffDialog
            open={isAddStaffDialogOpen}
            onOpenChange={setIsAddStaffDialogOpen}
          />
        </div>
      </div>

      <GlobalTabs
        defaultValue="today"
        tabs={[
          {
            value: "today",
            label: "Today's Attendance",
            icon: Clock,
            content: (
              <>
                {/* Filters */}
                <FilterSectionStaffTable/>
                <div className="overflow-x-auto">
                  <TodayAttendanceTable  />
                </div>
              </>
            )
          },
          {
            value: "history",
            label: "Attendance History",
            icon: CalendarIcon,
            content: (
              <>
                {/* Date Filter */}
                <div className="overflow-x-auto">
                  <AttendanceHistoryStaff />
                </div>
              </>
            )
          }
        ]}
      />
    </div>
  )
}
