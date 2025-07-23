import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, LayoutDashboard, CloudUpload, ChevronDown, Search, Download, ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import useDebounce from "@/hooks/useDebounce";
// Remove unavailable imports and hooks, adapt as needed for your project

// Placeholder for hooks/utilities not present in your codebase
const useHelperApi = (fn: any) => ({ fetchData: fn });
const binaryToBlobImageConverter = (data: any, filename: string) => { };

export default function GlobalTable({
  columns,
  data,
  loading = false,
  exportFunction,
  title,
  deleteApiFunction,
  apiFunction,
  stateList = [],
  currentPage = 1,
  setCurrentPage = () => { },
  currentPageCount = 10,
  setCurrentPageCount = () => { },
  totalPages = 1,
  totalCount = 0,
  updateList = () => { },
  ListFetchAPI = () => { },
  isImportRequired = false,
  cardView = false,
  isSearchFieldRequired = true
}: any) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selected, setSelected] = useState<Array<string>>([]);
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false);
  const [isDeletDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [activeView, setActiveView] = useState("table");

  //   const debounceFunction = useDebounce(apiFunction, 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setSearchValue(text);
    if (text || text === "") {
      //   debounceFunction(text, currentPageCount, currentPage);
    }
  };

  const getLimitOptionList = (totalCount: number) => {
    const defaultSizes = [10, 20, 50, 100];
    const validSizes = defaultSizes.filter((size) => size <= totalCount);
    const sizes = validSizes.length > 0 ? validSizes : [defaultSizes[0]];

    return sizes.map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ));
  };

  const { fetchData: exportAsExcel } = useHelperApi(exportFunction);

  const onHandleExport = async (isExportAll: boolean) => {
    if (isExportAll) {
      const result: any = await exportAsExcel(isExportAll);
      binaryToBlobImageConverter(result, `${title}.xlsx`);
      return;
    }
    const result: any = await exportAsExcel(isExportAll, selected);
    binaryToBlobImageConverter(result, `${title}.xlsx`);
  };

  const { fetchData: deleteData } = useHelperApi(deleteApiFunction);
  const onHandleDelete = async (isDeleteAll: boolean) => {
    setIsDeleteAll(isDeleteAll);
    setDeleteDialogOpen(true);
  };
  const handleSelectAll = (checked: boolean) => {
    const filteredLIdx = stateList.map((item: any) => item?._id || item?.id);
    if (checked) {
      setSelected(filteredLIdx);
    } else {
      setSelected([]);
    }
    setIsSelectAll(checked);
  };
  const handleSingleSelect = (id: string) => {
    const findIndex = selected.findIndex((item: any) => item === id);
    if (findIndex >= 0) {
      const filteredLIdx = selected.filter((item: any) => item !== id);
      setSelected(filteredLIdx);
      setIsSelectAll(false);
    } else {
      setSelected([id, ...selected]);
    }
  };






  return (
    <div className="space-y-4 w-full mr-0 sm:mr-10 md:mr-20">
            <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between gap-2 md:gap-4">
      {/* Search Bar */}
      {isSearchFieldRequired && <div className="relative w-full max-w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-5" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={handleChange}
          className="pl-10 w-full px-4 py-2 md:px-8 md:py-4"
        />
      </div>}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start md:items-center gap-2 w-full md:w-auto">
        {cardView && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setActiveView("table")}
              className={`px-4 py-2 rounded-sm text-sm ${activeView === "table"
                  ? "bg-[#02837A] text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              <List />
            </button>
            <button
              onClick={() => setActiveView("card")}
              className={`px-4 py-2 rounded-sm text-sm ${activeView === "card"
                  ? "bg-[#02837A] text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              <LayoutDashboard />
            </button>
          </div>
        )}
        {selected?.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border-gray-800 px-5 py-1 rounded-sm border-1">
              Delete
              <ChevronDown className="w-4 h-4 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  className="flex items-center w-full gap-2 cursor-pointer bg-white text-black border-gray-600 hover:border-gray-950 hover:bg-gray-200"
                  onClick={() => onHandleDelete(false)}
                >
                  Delete {selected?.length > 0 && `(${selected?.length})`}
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer bg-white text-black border-gray-600 hover:border-gray-950 hover:bg-gray-200"
                  onClick={() => onHandleDelete(true)}
                >
                  Delete All <Trash2 className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 border-gray-800 px-5 py-1 rounded-sm border-1">
            Export
            <ChevronDown className="w-4 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer bg-white text-black border-gray-600 hover:border-gray-950 hover:bg-gray-200 w-full"
                onClick={() => onHandleExport(false)}
              >
                <Download className="w-full" />
                Export
              </Button>
            </DropdownMenuItem>

            {isImportRequired && (
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  className="w-full border border-gray-700"
                  onClick={() => setOpenImportDialog(true)}
                >
                  <CloudUpload /> Import
                </Button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              {" "}
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer bg-white text-black border-gray-600 hover:border-gray-950 hover:bg-gray-200"
                onClick={() => onHandleExport(true)}
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

      <div className="border rounded-lg w-full overflow-x-auto">
        {activeView === "table" ? (
          <Table className="w-full min-w-[600px] md:min-w-0">
            <TableHeader className="bg-gray-200 text-center">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    className="border-gray-700"
                    checked={isSelectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                {columns?.map((column: any, index: number) => (
                  <TableHead
                    key={index}
                    className="font-medium text-gray-700 text-center"
                  >
                    {column?.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length + 1}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-gray-800" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.length > 0 ? (
                data?.map((item: any, rowIndex: number) => (
                  <TableRow
                    key={rowIndex}
                    className="hover:bg-gray-50 text-center"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(item._id || item.id)}
                        onCheckedChange={() => handleSingleSelect(item._id || item.id)}
                        aria-label={`Select row ${rowIndex + 1}`}
                        className="border-gray-700 text-center"
                      />
                    </TableCell>
                    {columns?.map((column: any, colIndex: number) => (
                      <TableCell key={colIndex} className="pl-5">
                        {column?.cell && column?.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length + 1}
                    className="text-center py-8 text-gray-500"
                  >
                    No data found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          cardView && <div>Card View Placeholder</div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        {data?.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-gray-700">
              Rows per page:
            </span>
            <select
              value={currentPageCount}
              onChange={(e) => {
                setCurrentPageCount(Number(e.target.value));
                setCurrentPage(1);
                apiFunction?.(searchValue, Number(e.target.value), 1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {getLimitOptionList(totalCount)}
            </select>
          </div>
        )}
        {data?.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  apiFunction?.(searchValue, currentPageCount, currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs md:text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  apiFunction?.(searchValue, currentPageCount, currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs and Import Placeholder - implement as needed in your project */}
      {/*
      <GlobalDialogBox
        open={isDeletDialogOpen}
        onOpenChange={handleCancelButtonClick}
        width="350px"
      >
        <h2 className="text-2xl font-bold">
          Delete {isDeleteAll ? "All" : "Selected"}
        </h2>
        <h4 className="text-sm text-gray-700">
          {` Are you sure, you want to delete ${isDeleteAll ? `All entries` : ` Selected entry`} ?`}
        </h4>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleCancelButtonClick}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteEntry}>
            Confirm
          </Button>
        </div>
      </GlobalDialogBox>

      {isImportRequired && (
        <ImportDialogGlobalTable
          openImportDialog={openImportDialog}
          setOpenImportDialog={setOpenImportDialog}
          ListFetchAPI={ListFetchAPI}
        />
      )}
      */}
    </div>
  );
} 