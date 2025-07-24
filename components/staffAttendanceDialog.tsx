import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns"

import { Badge } from "./ui/badge";

const StaffAttendanceDialog = ({
  isStaffCalendarOpen,
  setIsStaffCalendarOpen,
  selectedStaffForCalendar,
  selectedCalendarDate,
  setSelectedCalendarDate,
}) => {
  // Helper: check if staff was present on a given date
  function isStaffAttendanceMarked(date) {
    const attendance = selectedStaffForCalendar?.attendance?.find(a =>
      new Date(a.date).toDateString() === date.toDateString()
    );
    return attendance?.status === "present";
  }

  // Helper: get attendance status for a given date
  function getStaffAttendanceStatus(date) {
    const attendance = selectedStaffForCalendar?.attendance?.find(a =>
      new Date(a.date).toDateString() === date.toDateString()
    );
    return {
      marked: attendance?.status === "present",
      clockIn: attendance?.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : null,
      clockOut: attendance?.checkOut ? new Date(attendance.checkOut).toLocaleTimeString() : null,
    };
  }

  return (
    <Dialog open={isStaffCalendarOpen} onOpenChange={setIsStaffCalendarOpen}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {selectedStaffForCalendar?.name} - Attendance Calendar
          </DialogTitle>
          <DialogDescription>
            Individual attendance history. Green dates indicate marked
            attendance, red dates indicate absence.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedCalendarDate}
              onSelect={setSelectedCalendarDate}
              className="rounded-md border shadow-sm scale-110" // scale up the calendar
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-10 h-10 font-normal text-base", // larger header cells
                row: "flex w-full mt-2 gap-2", // add gap between rows
                cell: "h-8 w-8 text-center text-base p-0 relative gap-2 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20", // larger cells and add gap
                day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100", // larger day buttons
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              modifiers={{
                future: (date) => date > new Date(new Date().setHours(0,0,0,0)),
                marked: (date) => {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  return date <= today && selectedStaffForCalendar
                    ? isStaffAttendanceMarked(date)
                    : false;
                },
                unmarked: (date) => {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  return date <= today && selectedStaffForCalendar
                    ? !isStaffAttendanceMarked(date)
                    : false;
                },
              }}
              modifiersStyles={{
                marked: {
                  backgroundColor: "#16a34a",
                  color: "white",
                  fontWeight: "600",
                },
                unmarked: {
                  backgroundColor: "#dc2626",
                  color: "white",
                  fontWeight: "600",
                },
                future: {
                  backgroundColor: "#d1d5db", // Tailwind gray-300
                  color: "#6b7280",           // Tailwind gray-500
                  fontWeight: "600",
                  opacity: 0.7,
                  cursor: "not-allowed",
                },
              }}
              disabled={(date) => date > new Date(new Date().setHours(0,0,0,0))}
            />
          </div>

          {selectedCalendarDate && selectedStaffForCalendar && (
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-slate-600" />
                <h4 className="font-semibold text-slate-900">
                  {format(selectedCalendarDate, "EEEE, MMMM d, yyyy")}
                </h4>
              </div>
              {(() => {
                const status = getStaffAttendanceStatus(selectedCalendarDate);
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          status.marked ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {status.marked ? "Present" : "Absent"}
                      </span>
                      {status.marked && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Attended
                        </Badge>
                      )}
                    </div>
                    {status.marked && status.clockIn && (
                      <div className="bg-white p-3 rounded border space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Clock In:</span>
                          <span className="text-slate-600">
                            {status.clockIn}
                          </span>
                        </div>
                        {status.clockOut && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="font-medium">Clock Out:</span>
                            <span className="text-slate-600">
                              {status.clockOut}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="flex items-center justify-center gap-8 py-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Absent</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffAttendanceDialog;
