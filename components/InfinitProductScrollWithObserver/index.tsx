import React from "react";
import ProductCards from "../productCard";
import GlobalLoader from "../common/GlobalLoader";

interface Product {
  id: number;
  name: string;
  price: number;
  // Add other fields as needed for your UI
  [key: string]: any;
}

interface InfiniteProductScrollWithIntersectionObserverProps {
  filteredProducts: Product[];
  cart: { [key: number]: number };
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  loaderRef: React.RefObject<HTMLDivElement>;
  finalServerData: boolean;
}

const InfiniteProductScrollWithIntersectionObserver = ({
  filteredProducts,
  cart,
  addToCart,
  removeFromCart,
  loaderRef,
  finalServerData,
  setImageModal,
}: InfiniteProductScrollWithIntersectionObserverProps) => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center">
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1"
        }
      >
        {filteredProducts?.length > 0 &&
          filteredProducts?.map((product, index) => (
            <ProductCards
              key={index}
              product={product}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              setImageModal={setImageModal}
            />
          ))}
      </div>

      {!finalServerData ? (
        <div
          ref={loaderRef}
          className="flex justify-center items-center mt-20"
        >
          <GlobalLoader message="Loading..." />
        </div>
      ) : (
        <div className="flex justify-center mt-20 ">No More Data.</div>
      )}
    </div>
  );
};

export default InfiniteProductScrollWithIntersectionObserver;
