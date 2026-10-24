import { createRootRoute, Outlet } from "@tanstack/react-router";
import {Header} from "../components/Header"

export const Route = createRootRoute({
    component : () => (
        <>
        <div className="min-h-screen bg-cream">

        <Header/>
        <main className="mx-auto max-w-7xl px-4 py-6">
            <Outlet/>
        </main>
        </div>
       </>
    ),
})