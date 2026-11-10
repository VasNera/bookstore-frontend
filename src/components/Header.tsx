import { ShoppingBag, User, Heart, LogOut, Package, Settings } from 'lucide-react'
import { CategoryMenu } from './CategoryMenu'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { useAuth } from '../auth/auth-context'
import { useCart } from '../hooks/useCart'
import { useIsAdmin } from '../hooks/useIsAdmin'


export function Header(){


    const navigate = useNavigate()
    const {user, signOut} = useAuth()
    const [text, setText] = useState('')
    const cart = useCart()
    const cartCount = cart.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
    const isAdmin = useIsAdmin()
    

    function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        navigate({to: '/products', search: {search: text.trim() || undefined, page: 0}})
    }

    return(
        <header className="border-b border-gray-200">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4">
              <Link to="/" className="text-2xl font-bold tracking-widest text-olive">BookstoreApp</Link>
                 <form onSubmit={handleSubmit} className="order-last w-full md:order-none md:w-auto md:flex-1">
                <input
                type="search"
                placeholder="Τι ψάχνεις;"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-full border border-black bg-white/60 px-5 py-3 outline-none focus:border-olive"
                />
                </form>
                 <div className="ml-auto flex items-center gap-4 text-brown md:gap-6">
                   {user ? (
                <>
                <Link to="/profile" className="flex flex-col items-center text-sm hover:text-olive">
                <User size={26} />
                 {user.username}
                  </Link>
                  {isAdmin && (
                <Link to="/admin/orders" className="flex flex-col items-center text-sm hover:text-olive">
                  <Settings size={26} />
                  Διαχείριση
                </Link>
              )}
              <Link to="/orders" className="flex flex-col items-center text-sm hover:text-olive">
                <Package size={26} />
                Παραγγελίες
              </Link>
               
                <button
                  onClick={signOut}
                 className="flex flex-col items-center text-sm hover:text-olive"
                  >
                <LogOut size={26} />
                 Έξοδος
                  </button>
                  </>
                  ) : (
                  <Link to="/login" className="flex flex-col items-center text-sm hover:text-olive">
                  <User size={26} />
                  Σύνδεση
                    </Link>
                    )}
                    <Link to="/favourites" className="flex flex-col items-center text-sm hover:text-olive">
                    <Heart size={26}/>
                     Αγαπημένα
                    </Link>
                    <Link to="/cart" className="relative flex flex-col items-center text-sm hover:text-olive">
                   <ShoppingBag size={26} />
                    {cartCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-olive px-1 text-xs text-white">
                    {cartCount}
                    </span>
                    )}
                     Καλάθι
                    </Link>

                 </div>
            </div>
            <CategoryMenu />
        </header>
    )
}