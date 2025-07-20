import React from 'react'
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const CartDisplay=({cart,products})=> {
  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
    <CardContent className="p-4">
      <h3 className="font-semibold mb-2">Cart Summary</h3>
      <div className="space-y-2 mb-4">
        {Object.entries(cart).map(([productId, quantity]) => {
          const product = products.find(
            (p) => p.id === Number.parseInt(productId)
          );
          if (!product) return null;
          return (
            <div key={productId} className="flex justify-between text-sm">
              <span>
                {product.name} x{quantity}
              </span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between font-semibold mb-4">
        <span>Total:</span>
        <span>
          $
          {Object.entries(cart)
            .reduce((total, [productId, quantity]) => {
              const product = products.find(
                (p) => p.id === Number.parseInt(productId)
              );
              return total + (product ? product.price * quantity : 0);
            }, 0)
            .toFixed(2)}
        </span>
      </div>
      <Button className="w-full">
        Checkout ({Object?.values(cart)?.reduce((a, b) => a + b, 0)} items)
      </Button>
    </CardContent>
  </Card>
  )
}

export default CartDisplay