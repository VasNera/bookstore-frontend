import { ShoppingBag, User, Heart } from 'lucide-react'
import { CategoryMenu } from './CategoryMenu'
import { Link } from '@tanstack/react-router'

export function Header(){
    return(
        <header className="border-b border-gray-200">
            <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-4">
              <Link to="/" className="text-2xl font-bold tracking-widest text-olive">BookstoreApp</Link>
                <input type="search"
                placeholder="Τι ψάχνεις;"
                className="flex-1 rounded-full border border-black bg-white/60 px-5 py-3 outline-none"
                 />
                 <div className="flex items-center gap-6 text-brown">
                    <button className="flex flex-col items-center text-sm hover:text-olive">
                        <User size={26}/>
                        Προφίλ
                    </button>
                    <button className="flex flex-col items-center text-sm hover:text-olive">
                        <Heart size={26}/>
                        Αγαπημένα
                    </button>
                    <button className="flex flex-col items-center text sm
                    hover:text-olive">
                        <ShoppingBag size={26}/>
                        Καλάθι
                    </button>

                 </div>
            </div>
            <CategoryMenu />
        </header>
    )
}