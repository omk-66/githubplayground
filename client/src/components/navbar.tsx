import  { useState } from 'react';
import { Button } from "@/components/ui/button"

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    return (
        <nav className="w-full bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="text-2xl font-semibold">
                    Your Logo
                </div>

                {/* Right: Search bar, Sign In, Get Started */}
                <div className="flex items-center space-x-6">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="px-4 py-2 rounded-lg text-black"
                    />

                    {/* Sign In Button */}
                    <a href="#signin" className="hover:text-gray-200">Sign In</a>

                    {/* Get Started Button */}
                    <Button size="sm" className="bg-blue-700 text-white hover:bg-blue-800">
                        Get Started
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
