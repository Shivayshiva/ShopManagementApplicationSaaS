import React from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import ProductCards from '../productCard'

const ImagePreviewProductList=({skuImagesOpen,setSkuImagesOpen,skuImages=[] })=> {
  return (
    <Dialog open={skuImagesOpen} onOpenChange={setSkuImagesOpen} >
        <DialogContent>
          {skuImages.length > 0 ? (
            // <div className="flex justify-center">
              <ProductCards product={{ _id: 0, name: 'SKU Images', images: skuImages, price: 0, discount: 0, stockQuantity: 1 }} cart={{}} addToCart={() => {}} removeFromCart={() => {}} />
            // </div>
          ) : (
            <div>No images available</div>
          )}
        </DialogContent>
      </Dialog>
  )
}

export default ImagePreviewProductList