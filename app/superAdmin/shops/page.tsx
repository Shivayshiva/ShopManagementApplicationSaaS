"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus,
  Trash2,
  Edit,
  ScreenShare,
} from "lucide-react";
import GlobalButton from "@/components/common/globalButton";
import SplashScreenCreationModal from "@/components/dummySplashScreen";
import SplashScreen, { TransitionStyle } from "@/components/splashScreenDisplayModal";
import { AnimationType } from "framer-motion";
import ShopRegistrationModal from "@/components/superAdminShopAddition";
import GlobalTable from "@/components/common/GlobalTable";
import { shopTableColumns } from "@/components/common/GlobalTableComponents";
import { useShops } from "@/hooks/useShops";



export default function ShopsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [splashSetupModal, setSplashSetupModal] = useState(false);
  const [splashSetupId, setSplashSetupId] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [config, setConfig] = useState({
    shopName: "Your Shop",
    slogan: "Quality & Excellence",
    logoSvg: "",
    logoWidth: 80, // Add this
    logoHeight: 80, // Add this
    backgroundColor: "#0f172a",
    textColor: "#f1f5f9",
    animationType: "particles" as AnimationType,
    transitionStyle: "fade" as TransitionStyle,
    duration: 3000,
  });

  const [newShop, setNewShop] = useState({
    name: "",
    owner: "",
    email: "",
    plan: "Basic",
    status: "pending" as const,
    created: new Date().toISOString().split("T")[0],
    revenue: "$0",
    users: 0,
    products: 0,
    lastLogin: "Never",
  });


  // Fetch shops from API
  const { shops, loading, error, pagination, refetch } = useShops({
    page,
    limit,
    search: searchTerm,
    // Optionally add status/plan filter to API if supported
  });

  // Filter client-side for status/plan if not supported by API
  const filteredShops = shops.filter((shop: any) => {
    const matchesStatus = statusFilter === "all" || shop.status === statusFilter;
    const matchesPlan = planFilter === "all" || shop.plan === planFilter;
    return matchesStatus && matchesPlan;
  });

  const handleAddShop = () => {
    if (!newShop.name || !newShop.owner || !newShop.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // addShop(newShop)
    setIsAddDialogOpen(false);
    setNewShop({
      name: "",
      owner: "",
      email: "",
      plan: "Basic",
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      revenue: "$0",
      users: 0,
      products: 0,
      lastLogin: "Never",
    });
    toast({
      title: "Shop Added",
      description: `${newShop.name} has been added successfully.`,
    });
  };

  const handleUpdateShop = () => {
    if (!editingShop) return;

    // updateShop(editingShop.id, editingShop)
    setEditingShop(null);
    toast({
      title: "Shop Updated",
      description: `${editingShop.name} has been updated successfully.`,
    });
  };

  const handleDeleteShop = (shopId: number, shopName: string) => {
    // deleteShop(shopId)
    toast({
      title: "Shop Deleted",
      description: `${shopName} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleShopAction = (shopId: number, action: string) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return;

    switch (action) {
      case "activate":
        // updateShop(shopId, { status: "active" })
        toast({
          title: "Shop Activated",
          description: `${shop.name} has been activated.`,
        });
        break;
      case "deactivate":
        // updateShop(shopId, { status: "inactive" })
        toast({
          title: "Shop Deactivated",
          description: `${shop.name} has been deactivated.`,
        });
        break;
      case "approve":
        // updateShop(shopId, { status: "active" })
        toast({
          title: "Shop Approved",
          description: `${shop.name} has been approved and activated.`,
        });
        break;
      case "impersonate":
        toast({
          title: "Impersonation Started",
          description: `You are now viewing ${shop.name}'s dashboard.`,
        });
        break;
      case "edit":
        setEditingShop({ ...shop });
        break;
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Name",
        "Owner",
        "Email",
        "Plan",
        "Status",
        "Revenue",
        "Users",
        "Products",
        "Created",
      ],
      ...filteredShops.map((shop) => [
        shop.name,
        shop.owner,
        shop.email,
        shop.plan,
        shop.status,
        shop.revenue,
        shop.users,
        shop.products,
        shop.created,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shops.csv";
    a.click();

    toast({
      title: "Export Complete",
      description: "Shops data has been exported to CSV.",
    });
  };

  const handleSplashSCreenCreation = (id:string) => {
    setSplashSetupModal(true);
    setSplashSetupId(id);
  };

  const handleSplashScreenClose = (id:string) => {
    setSplashSetupModal(false);
    setSplashSetupId("");
  };

  const handlePreviewCompleteFn = () => {
    setShowSplash(false);
    setSplashSetupModal(true);
  };

  console.log("Shops_data", shops);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Shop Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <ShopRegistrationModal />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search through all shops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shops..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shops Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Shops ({filteredShops.length})</CardTitle>
          <CardDescription>
            Manage all registered shops and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalTable
            columns={shopTableColumns(handleShopAction, handleDeleteShop, handleSplashSCreenCreation)}
            data={shops}
            loading={loading}
            title="Shops"
            currentPage={page}
            setCurrentPage={setPage}
            currentPageCount={limit}
            setCurrentPageCount={setLimit}
            totalPages={pagination?.totalPages || 1}
            totalCount={pagination?.total || 0}
          />
        </CardContent>
      </Card>


      <SplashScreenCreationModal
        open={splashSetupModal}
        onOpenChange={handleSplashScreenClose}
        setShowSplash={setShowSplash}
        config={config}
        setConfig={setConfig}
        setSplashSetupModal={setSplashSetupModal}
        splashSetupId={splashSetupId}
      />

      {showSplash && (
        <SplashScreen
          shopName={config.shopName}
          slogan={config.slogan}
          logoSvg={config.logoSvg}
          logoWidth={config.logoWidth}
          logoHeight={config.logoHeight}
          backgroundColor={config.backgroundColor}
          textColor={config.textColor}
          animationType={config.animationType}
          duration={config.duration}
          transitionStyle={config.transitionStyle}
          onComplete={handlePreviewCompleteFn}
        />
      )}
    </div>
  );
}
