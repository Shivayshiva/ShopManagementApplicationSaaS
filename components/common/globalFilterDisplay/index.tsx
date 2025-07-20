import { Badge } from "@/components/ui/badge";
import React from "react";

const GlobalFilterDisplay = ({
  selectedCategories,
  setSelectedCategories,
  selectedTypes,
  setSelectedTypes,
  selectedAvailability,
  setSelectedAvailability,
  selectedRatings,
  setSelectedRatings,
  selectedColors,
  setSelectedColors,
  setPriceRange,
  priceRange

}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {selectedCategories
        .filter((c) => c !== "all")
        .map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="cursor-pointer"
            onClick={() =>
              setSelectedCategories((prev) =>
                prev.filter((c) => c !== category)
              )
            }
          >
            Category: {category} <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
      {selectedTypes
        .filter((t) => t !== "all")
        .map((type) => (
          <Badge
            key={type}
            variant="secondary"
            className="cursor-pointer"
            onClick={() =>
              setSelectedTypes((prev) => prev.filter((t) => t !== type))
            }
          >
            Type: {type} <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
      {selectedAvailability
        .filter((a) => a !== "all")
        .map((availability) => (
          <Badge
            key={availability}
            variant="secondary"
            className="cursor-pointer"
            onClick={() =>
              setSelectedAvailability((prev) =>
                prev.filter((a) => a !== availability)
              )
            }
          >
            {availability === "in-stock" ? "In Stock" : "Out of Stock"}{" "}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
      {selectedRatings.map((rating) => (
        <Badge
          key={rating}
          variant="secondary"
          className="cursor-pointer"
          onClick={() =>
            setSelectedRatings((prev) => prev.filter((r) => r !== rating))
          }
        >
          {rating}+ Stars <X className="h-3 w-3 ml-1" />
        </Badge>
      ))}
      {selectedColors
        .filter((c) => c !== "all")
        .map((color) => (
          <Badge
            key={color}
            variant="secondary"
            className="cursor-pointer"
            onClick={() =>
              setSelectedColors((prev) => prev.filter((c) => c !== color))
            }
          >
            Color: {color} <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
      {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
        <Badge
          variant="secondary"
          className="cursor-pointer"
          onClick={() => setPriceRange([0, 200])}
        >
          Price: ${priceRange[0]} - ${priceRange[1]}{" "}
          <X className="h-3 w-3 ml-1" />
        </Badge>
      )}
    </div>
  );
};

export default GlobalFilterDisplay;
