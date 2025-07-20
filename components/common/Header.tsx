import React from 'react'
import { GlobalBadge } from './badge'
import ShoppingCartButton from './shoppingCart'
import { Button } from '../ui/button'
import { Menu } from 'lucide-react'

const HeaderSection=({handleSidebarOpen})=> {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={handleSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-extrabold font-serif ">
                Vaishno Vastralaya
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <GlobalBadge />
              <ShoppingCartButton />
            </div>
          </div>
        </header>
  )
}

export default HeaderSection