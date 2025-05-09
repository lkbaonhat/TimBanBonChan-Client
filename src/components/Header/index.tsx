"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, Phone, Bell, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-[#FFEDFA] py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center mr-4 relative z-10 xl:left-30 left-0"
          >
            <img
              src="/logowithoutTitle.png"
              alt="Tìm Bạn Bốn Chân"
              className="h-20 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/120x50?text=Logo";
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/community"
              className="px-4 py-2 text-gray-700 hover:text-white  rounded-full hover:bg-pink-300 transition-all duration-200"
            >
              Cộng đồng
            </Link>
            <Link
              to="/adopt"
              className="px-4 py-2 text-gray-700 hover:text-white  rounded-full hover:bg-pink-300 transition-all duration-200"
            >
              Nhận nuôi bé cưng
            </Link>
            <Link
              to="/search"
              className="px-4 py-2 text-gray-700 hover:text-white  rounded-full hover:bg-pink-300 transition-all duration-200"
            >
              Tìm nhà cho bé yêu
            </Link>
            <Link
              to="/pet-care"
              className="px-4 py-2 text-gray-700 hover:text-white  rounded-full hover:bg-pink-300 transition-all duration-200"
            >
              Sổ tay chăm sóc
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <Search size={20} />
            </button>
            <button
              aria-label="Cart"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <ShoppingCart size={20} />
            </button>
            <button
              aria-label="Contact"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <Phone size={20} />
            </button>
            <button
              aria-label="Notifications"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <Bell size={20} />
            </button>
            <button
              aria-label="Account"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
            >
              <User size={18} className="mr-2" />
              <span>Đăng nhập</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors mr-1"
            >
              <Search size={20} />
            </button>
            <button
              className="p-2 text-gray-700 ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-xl shadow-lg animate-fade-down">
            <nav className="flex flex-col space-y-1 px-4">
              <Link
                to="/community"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Cộng đồng
              </Link>
              <Link
                to="/adopt"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Nhận nuôi bé cưng
              </Link>
              <Link
                to="/search"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Tìm nhà cho bé yêu
              </Link>
              <Link
                to="/pet-care"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sổ tay chăm sóc các bé
              </Link>

              <div className="flex justify-between pt-4 border-t border-gray-100 mt-2">
                <button
                  aria-label="Cart"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart size={20} />
                </button>
                <button
                  aria-label="Contact"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Phone size={20} />
                </button>
                <button
                  aria-label="Notifications"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Bell size={20} />
                </button>
                <button
                  aria-label="Account"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User size={20} />
                </button>
              </div>

              <button className="mt-3 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Đăng nhập
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
