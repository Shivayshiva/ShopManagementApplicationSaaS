import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "../ui/card";
import GlobalTable from "../common/GlobalTable";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import StaffAttendanceDialog from "../staffAttendanceDialog";
import { useStaff } from "@/hooks/useStaff";

const attendanceHistory = [
  {
    id: 1,
    name: "John Smith",
    date: "2024-01-15",
    clockIn: "09:00 AM",
    clockOut: "06:00 PM",
    totalHours: "9:00",
    status: "present",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    date: "2024-01-15",
    clockIn: "09:15 AM",
    clockOut: "05:45 PM",
    totalHours: "8:30",
    status: "present",
  },
  {
    id: 3,
    name: "Mike Wilson",
    date: "2024-01-15",
    clockIn: null,
    clockOut: null,
    totalHours: "0:00",
    status: "absent",
  },
  {
    id: 4,
    name: "Emily Davis",
    date: "2024-01-15",
    clockIn: "08:45 AM",
    clockOut: "06:15 PM",
    totalHours: "9:30",
    status: "present",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "present":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Present
        </Badge>
      );
    case "absent":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Absent
        </Badge>
      );
    case "late":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Late
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const staffAttendanceData: Record<
  number,
  Record<
    string,
    { marked: boolean; status: string; clockIn?: string; clockOut?: string }
  >
> = {
  1: {
    // John Smith
    "2024-01-15": {
      marked: true,
      status: "present",
      clockIn: "09:00 AM",
      clockOut: "06:00 PM",
    },
    "2024-01-14": {
      marked: true,
      status: "present",
      clockIn: "09:05 AM",
      clockOut: "06:10 PM",
    },
    "2024-01-13": { marked: false, status: "absent" },
    "2024-01-12": {
      marked: true,
      status: "present",
      clockIn: "09:00 AM",
      clockOut: "06:00 PM",
    },
    "2024-01-11": { marked: false, status: "absent" },
    "2024-01-10": {
      marked: true,
      status: "present",
      clockIn: "08:55 AM",
      clockOut: "06:05 PM",
    },
  },
  2: {
    // Sarah Johnson
    "2024-01-15": {
      marked: true,
      status: "present",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
    },
    "2024-01-14": {
      marked: true,
      status: "present",
      clockIn: "09:10 AM",
      clockOut: "05:50 PM",
    },
    "2024-01-13": {
      marked: true,
      status: "present",
      clockIn: "09:20 AM",
      clockOut: "05:40 PM",
    },
    "2024-01-12": { marked: false, status: "absent" },
    "2024-01-11": {
      marked: true,
      status: "present",
      clockIn: "09:15 AM",
      clockOut: "05:45 PM",
    },
    "2024-01-10": {
      marked: true,
      status: "present",
      clockIn: "09:12 AM",
      clockOut: "05:48 PM",
    },
  },
  3: {
    // Mike Wilson
    "2024-01-15": { marked: false, status: "absent" },
    "2024-01-14": {
      marked: true,
      status: "present",
      clockIn: "09:30 AM",
      clockOut: "06:30 PM",
    },
    "2024-01-13": { marked: false, status: "absent" },
    "2024-01-12": { marked: false, status: "absent" },
    "2024-01-11": {
      marked: true,
      status: "present",
      clockIn: "09:25 AM",
      clockOut: "06:25 PM",
    },
    "2024-01-10": {
      marked: true,
      status: "present",
      clockIn: "09:20 AM",
      clockOut: "06:20 PM",
    },
  },
  4: {
    // Emily Davis
    "2024-01-15": {
      marked: true,
      status: "present",
      clockIn: "08:45 AM",
      clockOut: "06:15 PM",
    },
    "2024-01-14": {
      marked: true,
      status: "present",
      clockIn: "08:50 AM",
      clockOut: "06:20 PM",
    },
    "2024-01-13": {
      marked: true,
      status: "present",
      clockIn: "08:40 AM",
      clockOut: "06:10 PM",
    },
    "2024-01-12": {
      marked: true,
      status: "present",
      clockIn: "08:45 AM",
      clockOut: "06:15 PM",
    },
    "2024-01-11": { marked: false, status: "absent" },
    "2024-01-10": {
      marked: true,
      status: "present",
      clockIn: "08:42 AM",
      clockOut: "06:12 PM",
    },
  },
};

function AttendanceHistoryStaff() {
  // Fetch staff data using TanStack Query
  const {
    data: staffResponse,
    isLoading,
    error,
  } = useStaff({
    limit: 100,
    isActive: true, 
  });

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    Date | undefined
  >(new Date());
  const [selectedStaffForCalendar, setSelectedStaffForCalendar] =
    useState<any>(null);
  const [isStaffCalendarOpen, setIsStaffCalendarOpen] = useState(false);

  console.log("df_wt_TY_sF_qE", staffResponse?.data)
  // Transform staff data to match the expected format
  const staffMembers =
    staffResponse?.data?.map((staff) => ({
      id: staff._id,
      name: staff.name,
      role: staff.role,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "present", 
      clockIn: null, 
      clockOut: null, 
      totalHours: "0:00", 
      date: "2025-07-13T11:20:12.164+00:00", 
    })) || [];

  const handleStaffCalendarOpen = (staffId: string, staff) => {
    // const staff = staffMembers.find((s) => s.id === staffId) || {
    //   id: staffId,
    //   name: staffName,
    // };
    setSelectedStaffForCalendar(staff);
    setIsStaffCalendarOpen(true);
  };

  const attendanceHistoryColumns = [
    {
      header: "Staff Member",
      cell: (record: any) => (
        <button
          onClick={() => handleStaffCalendarOpen(record?._id,record)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {record.name}
        </button>
      ),
    },
    {
      header: "Joining Date",
      cell: (record: any) => {
        return record?.joiningDate || "-";
      },
    },

    {
      header: "Category",
      cell: (record: any) => record?.category || "-",
    },

    {
        header: "Phone",
        cell: (record: any) => record?.phone || "-",
      },
      {
        header: "Emergency Phone",
        cell: (record: any) => record?.familyPhone || "-",
      },
      {
        header: "Role",
        cell: (record: any) => record?.role || "-",
      },
    {
      header: "Clock In",
      cell: (record: any) =>  record?.attendance?.find(
        (item) => item?.date?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      )?.checkIn ?? "-",
    },
    {
      header: "Clock Out",
      cell: (record: any) =>  record?.attendance?.find(
        (item) => item?.date?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      )?.checkOut ?? "-",
    },
    // {
    //   header: "Total Hours",
    //   cell: (record: any) => record?.totalHours,
    // },
    // {
    //   header: "Status",
    //   cell: (record: any) => getStatusBadge(record?.status),
    // },
  ];

  const getStaffAttendanceStatus = (staffId: string, date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const staffData =
      (
        staffAttendanceData as Record<
          string,
          Record<
            string,
            {
              marked: boolean;
              status: string;
              clockIn?: string;
              clockOut?: string;
            }
          >
        >
      )[staffId] || {};
    return staffData[dateKey] || { marked: false, status: "absent" };
  };

  const isStaffAttendanceMarked = (staffId: string, date: Date) => {
    const status = getStaffAttendanceStatus(staffId, date);
    return status.marked;
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Historical attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading staff data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Historical attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">
              Error loading staff data: {error.message}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Historical attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalTable
            columns={attendanceHistoryColumns}
            data={staffResponse?.data}
            title="Attendance History"
            isSearchFieldRequired={false}
          />
        </CardContent>
      </Card>

      <StaffAttendanceDialog
        isStaffCalendarOpen={isStaffCalendarOpen}
        setIsStaffCalendarOpen={setIsStaffCalendarOpen}
        selectedStaffForCalendar={selectedStaffForCalendar}
        selectedCalendarDate={selectedCalendarDate}
        setSelectedCalendarDate={setSelectedCalendarDate}
        isStaffAttendanceMarked={isStaffAttendanceMarked}
        getStaffAttendanceStatus={getStaffAttendanceStatus}
      />
    </>
  );
}

export default AttendanceHistoryStaff;
