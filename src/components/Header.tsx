import { AlertTriangle, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, setToken, setEmail } = useSubscription();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("subscription_token");
    localStorage.removeItem("subscription_email");
    setToken(null);
    setEmail(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-0 animate-ripple rounded-full bg-techtoniq-teal/30"></span>
              <AlertTriangle className="h-6 w-6 text-techtoniq-teal" />
            </div>
            <span className="text-xl font-bold text-techtoniq-earth-dark">
              Techtoniq
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link to="/real-time-data" className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue">
            AI Analysis
          </Link>
          <Link to="/safety-guidelines" className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue">
            Prepare
          </Link>
          <Link to="/emergency-resources" className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue">
            Protect
          </Link>
          <Link to="/educational-materials" className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-teal">
            Education
          </Link>
          <Link to="/latest-news" className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue">
            News
          </Link>
          <Link to="/contact-us" className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue">
            Contact
          </Link>
          <Link
            to="/my-location"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-teal"
          >
            My Location
          </Link>

          {token ? (
            <>
              <Link to="/premium" className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition">
                Premium
              </Link>
              <button onClick={handleLogout} className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <Link to="/subscribe" className="rounded-md bg-techtoniq-blue px-4 py-2 text-sm font-medium text-white hover:bg-techtoniq-teal transition">
              Subscribe
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-white p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link to="/real-time-data" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              AI Analysis
            </Link>
            <Link to="/safety-guidelines" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              Prepare
            </Link>
            <Link to="/emergency-resources" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              Protect
            </Link>
            <Link to="/educational-materials" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              Education
            </Link>
            <Link to="/latest-news" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              News
            </Link>
            <Link to="/contact-us" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              Contact
            </Link>
            <Link to="/my-location" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue">
              My Location
            </Link>

            {token ? (
              <>
                <Link to="/premium" onClick={() => setIsMenuOpen(false)} className="w-full rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 transition">
                  Premium
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/subscribe" onClick={() => setIsMenuOpen(false)} className="w-full rounded-md bg-techtoniq-blue px-4 py-2 text-center text-sm font-medium text-white hover:bg-techtoniq-teal transition">
                Subscribe
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
