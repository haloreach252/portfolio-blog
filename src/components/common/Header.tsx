"use client"

import Link from "next/link"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { Menu, MenuItem, IconButton, Typography } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';
import React, { useState, MouseEvent} from "react"

const Header = () => {
    const { data: session } = useSession();
    const router = useRouter();

    // State for mobile menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: 'http://localhost:3000' });
        router.push("/");
    }

    return (
        <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Miniverse Blog
                </Link>

                <ul className="hidden md:flex space-x-6 items-center">
                    <li>
                        <Link href="/posts" className="hover:text-gray-400">
                            Posts
                        </Link>
                    </li>

                    {session ? (
                        <>
                            <li>
                                <Link href="/auth/profile" className="hover:text-gray-400">
                                    Profile
                                </Link>
                            </li>

                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-gray-400 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/auth/sign-in" className="hover:text-gray-400">
                                    Sign In
                                </Link>
                            </li>

                            <li>
                                <Link href="/auth/sign-up" className="hover:text-gray-400">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Header;