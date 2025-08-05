import {
  Activity,
  CheckCircle,
  Clock,
  Edit,
  List,
  MoreHorizontal,
  ScreenShare,
  Sparkle,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import GlobalButton from "./globalButton";
import SplashScreenModal from "../SplashListModal";
import ShopDetailsModal from "../shopDetailsModal";

export const shopTableColumns = (
  handleShopAction,
  handleDeleteShop,
  handleSplashScreenCreation,
  handleOpenSplashScreensList
) => {
  return [
    {
      header: "Shop",
      cell: (shop: any) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={shop?.shopLogoUrl ?? ""} />
            <AvatarFallback>{shop?.shopName}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{shop?.shopName}</div>
            <div className="text-sm text-muted-foreground">
              {shop?.shopCode ?? "UP1244ER546"}
            </div>
          </div>
        </div>
      ),
    },
    { header: "Owner", cell: (shop: any) => shop?.ownerName },
    {
      header: "Plan",
      cell: (shop: any) => (
        <Badge variant="outline">{shop?.subscriptionPlan ?? "Demo"}</Badge>
      ),
    },
    {
      header: "Status",
      cell: (shop: any) => (
        <Badge
          variant={
            shop?.shopStatus === "active"
              ? "default"
              : shop?.shopStatus === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {shop?.shopStatus === "active" && (
            <CheckCircle className="mr-1 h-3 w-3" />
          )}
          {shop?.shopStatus === "pending" && <Clock className="mr-1 h-3 w-3" />}
          {shop?.shopStatus === "inactive" && (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {shop?.shopStatus === "active"
            ? "Active"
            : shop?.shopStatus === "pending"
            ? "Pending"
            : "Inactive"}
        </Badge>
      ),
    },
    { header: "Users", cell: (shop: any) => shop?.accountUsers?.length },
    { header: "Products", cell: (shop: any) => shop?.products?.length },
    {
      header: "Revenue",
      cell: (shop: any) => (
        <span className="font-medium">{shop?.revenueTotalGenerated}</span>
      ),
    },
    {
      header: "Last Login",
      cell: (shop: any) => (
        <span className="text-sm text-muted-foreground">{shop?.lastLogin}</span>
      ),
    },
    {
      header: "Actions",
      cell: (shop: any) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleShopAction(shop.id, "edit")}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Shop
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShopAction(shop.id, "impersonate")}
              >
                <Users className="mr-2 h-4 w-4" /> Impersonate Login
              </DropdownMenuItem>
              {shop.status === "pending" && (
                <DropdownMenuItem
                  onClick={() => handleShopAction(shop.id, "approve")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve Shop
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  handleShopAction(
                    shop.id,
                    shop.status === "active" ? "deactivate" : "activate"
                  )
                }
              >
                <Activity className="mr-2 h-4 w-4" />
                {shop.status === "active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteShop(shop.id, shop.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Shop
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      header: "Shop Details",
      cell: (shop: any) => (
       <ShopDetailsModal shopId={shop?._id} />
      ),
    },
    {
      header: "Logo",
      cell: (shop: any) => (
        <GlobalButton
          text={"Create Splash"}
          icon={<ScreenShare />}
          onClick={() => handleSplashScreenCreation(shop._id)}
        />
      ),
    },
    {
      header: "Logo",
      cell: (shop: any) => (
        <GlobalButton
          text={`All Splash Screens (${shop?.splashScreen?.length || 0})`}
          icon={<Sparkle />}
          onClick={() => handleOpenSplashScreensList(shop.splashScreen || [], shop)}
        />
      ),
    },
  ];
};
