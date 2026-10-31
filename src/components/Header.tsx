import { ShoppingBag, User, Heart, Search } from 'lucide-react'
import { CategoryMenu } from './CategoryMenu'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'


export function Header(){


    const navigate = useNavigate()
    const [text, setText] = useState('')

    function handleSubmit(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        navigate({to: '/products', search: {search: text.trim() || undefined, page: 0}})
    }

    return(
        <header className="border-b border-gray-200">
            <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-4">
              <Link to="/" className="text-2xl font-bold tracking-widest text-olive">BookstoreApp</Link>
                 <form onSubmit={handleSubmit} className="flex-1">
                <input
                type="search"
                placeholder="Τι ψάχνεις;"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-full border border-black bg-white/60 px-5 py-3 outline-none focus:border-olive"
                />
                </form>
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