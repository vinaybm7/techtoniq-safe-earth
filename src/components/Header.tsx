
import { AlertTriangle, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            to="/real-time-data"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue"
          >
            Real-Time Data
          </Link>
          <Link
            to="/safety-guidelines"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue"
          >
            Safety
          </Link>
          <Link
            to="/educational-materials"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue"
          >
            Education
          </Link>
          <Link
            to="/emergency-resources"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue"
          >
            Resources
          </Link>
          <Link
            to="/latest-news"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue"
          >
            News
          </Link>
          <Link
            to="/contact-us"
            className="text-sm font-medium text-techtoniq-earth-dark hover:text-techtoniq-blue"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-white p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/real-time-data"
              className="rounded-md px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Real-Time Data
            </Link>
            <Link
              to="/safety-guidelines"
              className="rounded-md px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Safety
            </Link>
            <Link
              to="/educational-materials"
              className="rounded-md px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Education
            </Link>
            <Link
              to="/emergency-resources"
              className="rounded-md px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/latest-news"
              className="rounded-md px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            <Link
              to="/contact-us"
              className="rounded-md px-4 py-2 text-lg font-medium text-techtoniq-earth-dark hover:bg-techtoniq-blue-light hover:text-techtoniq-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
