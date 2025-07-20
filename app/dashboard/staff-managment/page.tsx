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

// Mock data



// Mock attendance data for calendar
const attendanceCalendarData: Record<string, { marked: boolean; presentCount: number; totalCount: number }> = {
  "2024-01-15": { marked: true, presentCount: 3, totalCount: 4 },
  "2024-01-14": { marked: true, presentCount: 4, totalCount: 4 },
  "2024-01-13": { marked: false, presentCount: 0, totalCount: 4 },
  "2024-01-12": { marked: true, presentCount: 2, totalCount: 4 },
  "2024-01-11": { marked: false, presentCount: 0, totalCount: 4 },
  "2024-01-10": { marked: true, presentCount: 4, totalCount: 4 },
  "2024-01-09": { marked: true, presentCount: 3, totalCount: 4 },
  "2024-01-08": { marked: false, presentCount: 0, totalCount: 4 },
  "2024-01-07": { marked: true, presentCount: 4, totalCount: 4 },
  "2024-01-06": { marked: false, presentCount: 0, totalCount: 4 },
  "2024-01-05": { marked: true, presentCount: 3, totalCount: 4 },
}

// Individual staff attendance data
  const staffAttendanceData: Record<number, Record<string, { marked: boolean; status: string; clockIn?: string; clockOut?: string }>> = {
    1: {
      // John Smith
      "2024-01-15": { marked: true, status: "present", clockIn: "09:00 AM", clockOut: "06:00 PM" },
      "2024-01-14": { marked: true, status: "present", clockIn: "09:05 AM", clockOut: "06:10 PM" },
      "2024-01-13": { marked: false, status: "absent" },
      "2024-01-12": { marked: true, status: "present", clockIn: "09:00 AM", clockOut: "06:00 PM" },
      "2024-01-11": { marked: false, status: "absent" },
      "2024-01-10": { marked: true, status: "present", clockIn: "08:55 AM", clockOut: "06:05 PM" },
    },
    2: {
      // Sarah Johnson
      "2024-01-15": { marked: true, status: "present", clockIn: "09:15 AM", clockOut: "05:45 PM" },
      "2024-01-14": { marked: true, status: "present", clockIn: "09:10 AM", clockOut: "05:50 PM" },
      "2024-01-13": { marked: true, status: "present", clockIn: "09:20 AM", clockOut: "05:40 PM" },
      "2024-01-12": { marked: false, status: "absent" },
      "2024-01-11": { marked: true, status: "present", clockIn: "09:15 AM", clockOut: "05:45 PM" },
      "2024-01-10": { marked: true, status: "present", clockIn: "09:12 AM", clockOut: "05:48 PM" },
    },
    3: {
      // Mike Wilson
      "2024-01-15": { marked: false, status: "absent" },
      "2024-01-14": { marked: true, status: "present", clockIn: "09:30 AM", clockOut: "06:30 PM" },
      "2024-01-13": { marked: false, status: "absent" },
      "2024-01-12": { marked: false, status: "absent" },
      "2024-01-11": { marked: true, status: "present", clockIn: "09:25 AM", clockOut: "06:25 PM" },
      "2024-01-10": { marked: true, status: "present", clockIn: "09:20 AM", clockOut: "06:20 PM" },
    },
    4: {
      // Emily Davis
      "2024-01-15": { marked: true, status: "present", clockIn: "08:45 AM", clockOut: "06:15 PM" },
      "2024-01-14": { marked: true, status: "present", clockIn: "08:50 AM", clockOut: "06:20 PM" },
      "2024-01-13": { marked: true, status: "present", clockIn: "08:40 AM", clockOut: "06:10 PM" },
      "2024-01-12": { marked: true, status: "present", clockIn: "08:45 AM", clockOut: "06:15 PM" },
      "2024-01-11": { marked: false, status: "absent" },
      "2024-01-10": { marked: true, status: "present", clockIn: "08:42 AM", clockOut: "06:12 PM" },
    },
  }

export default function StaffAttendancePage() {
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false)

  // Update current time every second
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  })


  // const presentCount = staffMembers.filter((s) => s.status === "present").length
  // const absentCount = staffMembers.filter((s) => s.status === "absent").length
  // const totalStaff = staffMembers.length



  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title 
            title="Staff Attendance"
            subtitle={`Today, ${format(new Date(), "EEEE, MMMM d, yyyy")} • ${currentTime}`}
          />
        </div>
        <div className="flex gap-2">
          <AddStaffDialog
            open={isAddStaffDialogOpen}
            onOpenChange={setIsAddStaffDialogOpen}
          />
        
          <GlobalButton
            text="Export"
            icon={<Download className="w-4 h-4" />}
            variant="outline"
            size="sm"
            className="bg-black text-white border-black rounded-lg hover:bg-gray-800"
          />
        </div>
      </div>

      {/* Stats Cards */}
      
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Staff"
          icon={<Users className="w-5 h-5" />}
          value={totalStaff}
          description="Total number of staff members"
          iconClassName="text-blue-600"
        />
        <StatCard
          title="Present"
          icon={<CheckCircle className="w-5 h-5" />}
          value={presentCount}
          description="Staff members present today"
          iconClassName="text-green-600"
        />
        <StatCard
          title="Absent"
          icon={<XCircle className="w-5 h-5" />}
          value={absentCount}
          description="Staff members absent today"
          iconClassName="text-red-600"
        />
        <StatCard
          title="Attendance Rate"
          icon={<Timer className="w-5 h-5" />}
          value={`${Math.round((presentCount / totalStaff) * 100)}%`}
          description="Current attendance percentage"
          iconClassName="text-orange-600"
        />
      </div> */}

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
                <TodayAttendanceTable  />
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
                <AttendanceHistoryStaff />
              </>
            )
          }
        ]}
      />
    </div>
  )
}
