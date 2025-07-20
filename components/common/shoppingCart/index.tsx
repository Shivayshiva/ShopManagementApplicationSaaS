import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const ShoppingCartButton = () => (
  <Button variant="ghost" size="icon">
    <ShoppingCart className="h-5 w-5" />
  </Button>
);

export default ShoppingCartButton;