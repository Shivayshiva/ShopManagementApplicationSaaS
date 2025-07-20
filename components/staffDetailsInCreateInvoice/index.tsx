import React, { forwardRef, useImperativeHandle } from "react";
import Title from "../common/Title";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStaff } from "@/hooks/useStaff";

// Minimal Zod schema for staff selection
const staffSelectSchema = z.object({
  selectedStaffId: z.string().min(1, "Please select a staff member"),
});

type StaffSelectData = z.infer<typeof staffSelectSchema>;

type StaffSelectionProps = {
  onStaffChange?: (staff: any) => void;
};

const StaffSelection = forwardRef<any, StaffSelectionProps>(({ onStaffChange }, ref) => {
  const { data: staffData, isLoading: staffLoading, error: staffError } = useStaff({ limit: 100, isActive: true });
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffSelectData>({
    resolver: zodResolver(staffSelectSchema),
    defaultValues: { selectedStaffId: "" },
  });

  const selectedStaffId = watch("selectedStaffId");
  const selectedStaff = staffData?.data?.find((s: any) => s._id === selectedStaffId) || null;

  React.useImperativeHandle(ref, () => ({ selectedStaff }), [selectedStaff]);

  React.useEffect(() => {
    if (onStaffChange) {
      onStaffChange(selectedStaff);
    }
  }, [selectedStaff, onStaffChange]);

  return (
    <div className="mb-6">
      <Title title="Select Staff" className="text-lg" />
      <Select
        value={selectedStaffId}
        onValueChange={val => setValue("selectedStaffId", val, { shouldValidate: true })}
      >
        <SelectTrigger className="w-full md:w-1/2">
          <SelectValue placeholder={staffLoading ? "Loading staff..." : "Select staff"} />
        </SelectTrigger>
        <SelectContent>
          {staffData?.data?.map((staff: any) => (
            <SelectItem key={staff._id} value={staff._id}>
              {staff.name} ({staff.role})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.selectedStaffId && (
        <div className="text-red-500 text-sm mt-1">{errors.selectedStaffId.message}</div>
      )}
      {staffError && (
        <div className="text-red-500 text-sm mt-1">{String(staffError)}</div>
      )}
    </div>
  );
});

StaffSelection.displayName = "StaffSelection";

export default StaffSelection;
