"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Search,
  X,
} from "lucide-react";
import { products } from "@/lib/dummyData";
import Title from "@/components/common/Title";

import ProductImageGalleryModal from "@/components/productImageGalleryModal";
import GlobalFilterDisplay from "@/components/common/globalFilterDisplay";
import CartDisplay from "@/components/cartDisplayModal";
import GlobalFilterDropdown from "@/components/common/GlobalFilterDropdown";
import InfiniteProductScrollWithIntersectionObserver from "@/components/InfinitProductScrollWithObserver";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page,setPage]=useState(1)
  const [productList,setProductList]=useState([])
  const [finalServerData,setFinalServerData]=useState(false)
  console.log("_sdfjp111111111111roduct_list",productList)
  const [imageModal, setImageModal] = useState<{
    productId: number | null;
    imageIdx: number;
  }>({ productId: null, imageIdx: 0 });

  const loaderRef = useRef<HTMLDivElement>(null);

  // const filteredProducts = products?.filter((product) => {
  //   const matchesSearch = product.name
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());

  //   const matchesCategory =
  //     selectedCategories.length === 0 || selectedCategories.includes("all")
  //       ? true
  //       : selectedCategories.includes(product.category || "");

  //   const matchesType =
  //     selectedTypes.length === 0 || selectedTypes.includes("all")
  //       ? true
  //       : selectedTypes.includes(product.type || "");

  //   const matchesAvailability =
  //     selectedAvailability.length === 0 || selectedAvailability.includes("all")
  //       ? true
  //       : selectedAvailability.includes(
  //           product.inStock ? "in-stock" : "out-of-stock"
  //         );

  //   const matchesRating =
  //     selectedRatings.length === 0
  //       ? true
  //       : selectedRatings.some(
  //           (rating) => Math.floor(product.rating) === rating
  //         );

  //   const matchesColor =
  //     selectedColors.length === 0 || selectedColors.includes("all")
  //       ? true
  //       : selectedColors.includes(product.color || "");

  //   const matchesPrice =
  //     product.price >= priceRange[0] && product.price <= priceRange[1];

  //   return (
  //     matchesSearch &&
  //     matchesCategory &&
  //     matchesType &&
  //     matchesAvailability &&
  //     matchesRating &&
  //     matchesColor &&
  //     matchesPrice
  //   );
  // });

  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedAvailability([]);
    setSelectedRatings([]);
    setSelectedColors([]);
    setPriceRange([0, 200]);
  };

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const types = [
    "all",
    ...Array.from(new Set(products.map((p) => p.type).filter(Boolean))),
  ];

  const colors = [
    "all",
    ...Array.from(new Set(products.map((p) => p.color).filter(Boolean))),
  ];

  const ratings = [1, 2, 3, 4, 5];

  const maxPrice = Math.max(...products.map((p) => p.price));
  const minPrice = Math.min(...products.map((p) => p.price));

  async function fetchProducts(pageNumber:number |string) {
    try {
      const response = await fetch(`/api/products?page=${pageNumber}`);
      const data = await response.json();
      if(data?.data?.length>0){
        setProductList((prev)=>[...prev, ...data?.data])
      }
      else{
        setFinalServerData(true)
      }
      
      console.log("Products_API_response", data?.data, data?.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
 

  useEffect(() => {
    fetchProducts(page);
  }, [page]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <Title
        title="Shop Display"
        subtitle="Browse and manage your product catalog"
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="relative flex-1 max-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>


        </div>

        <div className="flex flex-wrap gap-2">
          <GlobalFilterDropdown
            label="Category"
            options={categories}
            selectedOptions={selectedCategories}
            onChange={setSelectedCategories}
            allLabel="All Categories"
          />

          <GlobalFilterDropdown
            label="Type"
            options={types}
            selectedOptions={selectedTypes}
            onChange={setSelectedTypes}
            allLabel="All Types"
          />

          <GlobalFilterDropdown
            label="Availability"
            options={["all", "in-stock", "out-of-stock"]}
            selectedOptions={selectedAvailability}
            onChange={setSelectedAvailability}
            allLabel="All Availability"
          />

          <GlobalFilterDropdown
            label="Rating"
            options={ratings.map(String)}
            selectedOptions={selectedRatings.map(String)}
            onChange={(selected: string[]) => setSelectedRatings(selected.map(Number))}
            allLabel="All Ratings"
          />

          <GlobalFilterDropdown
            label="Color"
            options={colors}
            selectedOptions={selectedColors}
            onChange={setSelectedColors}
            allLabel="All Colors"
          />

          <GlobalFilterDropdown
            label="Price"
            options={["all", `${minPrice}`, `${maxPrice}`]}
            selectedOptions={priceRange.map(String)}
            onChange={(selected: string[]) => {
              if (selected.includes("all")) {
                setPriceRange([0, 200]);
              } else if (selected.length === 2) {
                setPriceRange(selected.map(Number) as [number, number]);
              }
            }}
            allLabel="All Prices"
          />

          {/* Clear Filters */}
          {(selectedCategories.length > 0 ||
            selectedTypes.length > 0 ||
            selectedAvailability.length > 0 ||
            selectedRatings.length > 0 ||
            selectedColors.length > 0 ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 200) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        <GlobalFilterDisplay
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>

      {/* <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      > */}
        <InfiniteProductScrollWithIntersectionObserver
          filteredProducts={productList}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          loaderRef={loaderRef}
          finalServerData={finalServerData}
          setImageModal={setImageModal}
        />
      {/* </div> */}

      {/* Cart Summary */}
      {Object.keys(cart).length > 0 && (
        <CartDisplay cart={cart} products={products} />
      )}

      {/* Image Gallery Modal */}
      
    </div>
  );
}
