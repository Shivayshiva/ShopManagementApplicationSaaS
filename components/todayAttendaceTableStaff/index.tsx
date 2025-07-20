import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import GlobalTable from "../common/GlobalTable";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import GlobalButton from "../common/globalButton";
import { Clock, DumbbellIcon } from "lucide-react";
import { useStaff, usePatchStaffAttendance } from "@/hooks/useStaff";

function TodayAttendanceTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch staff data using the API
  const {
    data: staffResponse,
    isLoading,
    error,
  } = useStaff({ limit: 100, isActive: true });

  const patchAttendance = usePatchStaffAttendance();

  // Map API data to table format
  const staffMembers =
    staffResponse?.data?.map((staff) => ({
      id: staff._id,
      name: staff.name,
      role: staff.role,
      avatar: "/StaffImage.jpg",
      status: staff?.attendance?.find(
        (item) => item?.date?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      )?.status || "absent",
      clockIn: staff?.attendance?.find(
        (item) => item?.date?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      )?.checkIn, // TODO: Replace with real clockIn if available
      clockOut:  staff?.attendance?.find(
        (item) => item?.date?.slice(0, 10) === new Date().toISOString().slice(0, 10)
      )?.checkOut, // TODO: Replace with real clockOut if available
      totalHours: "0:00", // TODO: Replace with real totalHours if available
    })) || [];

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

  const handleClockIn = (staffId: string) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const clockingTime = now.toISOString(); 
    patchAttendance.mutate({
      id: staffId,
      data: {
        date,
        clockingTime,
        status: "present",
      },
    });
  };

  const handleClockOut = (staffId: number | string) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const clockoutTime = now.toISOString(); 
    patchAttendance.mutate({
      id: staffId,
      data: {
        date,
        clockoutTime,
        status: "present",
      },
    });
  };

  const staffColumns = [
    {
      header: "Staff Member",
      cell: (staff: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={staff.avatar || "/placeholder.svg"}
              alt={staff.name}
            />
            <AvatarFallback>
              {staff.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{staff.name}</span>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (staff: any) => staff.role,
    },
    {
      header: "Status",
      cell: (staff: any) => getStatusBadge(staff.status),
    },
    {
      header: "Clock In",
      cell: (staff: any) => staff.clockIn || "-",
    },
    {
      header: "Clock Out",
      cell: (staff: any) => staff?.clockOut || "-",
    },
    {
      header: "Actions",
      cell: (staff: any) => (
        <div className="flex gap-2">
          {!staff.clockIn && !staff.clockOut ? (
            <GlobalButton
              text="Clock In"
              icon={<Clock className="w-4 h-4" />}
              size="sm"
              onClick={() => handleClockIn(staff?.id)}
              className="bg-green-700 text-white rounded-lg hover:bg-green-400"
            />
          ) : staff.clockIn && !staff.clockOut ? (
            <GlobalButton
              text="Clock Out"
              icon={<Clock className="w-4 h-4" />}
              size="sm"
              variant="outline"
              onClick={() => handleClockOut(staff?.id)}
              className="bg-red-600 text-white  rounded-lg hover:text-black hover:bg-red-300"
            />
          ) : staff.clockIn && staff.clockOut ? (
            <Badge className="py-2 px-4 bg-yellow-300 rounded-lg text-yellow-900 font-semibold text-md">
              Completed
            </Badge>
          ) : null}
        </div>
      ),
    },
  ];
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = staff.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || staff.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Status</CardTitle>
          <CardDescription>Current attendance status for today</CardDescription>
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
          <CardTitle>Staff Status</CardTitle>
          <CardDescription>Current attendance status for today</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle>Staff Status</CardTitle>
        <CardDescription>Current attendance status for today</CardDescription>
      </CardHeader>
      <CardContent>
        <GlobalTable
          columns={staffColumns}
          data={filteredStaff}
          title="Staff Attendance"
          isSearchFieldRequired={false}
        />
      </CardContent>
    </Card>
  );
}

export default TodayAttendanceTable;
