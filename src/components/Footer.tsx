
import { AlertTriangle, Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-techtoniq-teal-light/30 to-techtoniq-blue-light/30 py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-techtoniq-teal" />
              <span className="text-lg font-bold text-techtoniq-earth-dark">Techtoniq</span>
            </Link>
            <p className="mt-2 text-sm text-techtoniq-earth">
              Prepare, Stay Safe, Recover - Your Earthquake Safety Resource
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-techtoniq-earth hover:text-techtoniq-blue">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-techtoniq-earth hover:text-techtoniq-blue">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-techtoniq-earth hover:text-techtoniq-blue">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-techtoniq-earth hover:text-techtoniq-blue">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-techtoniq-earth-dark">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/real-time-data" className="text-techtoniq-earth hover:text-techtoniq-blue">Real-Time Data</Link>
              </li>
              <li>
                <Link to="/earthquake-statistics" className="text-techtoniq-earth hover:text-techtoniq-blue">Earthquake Statistics</Link>
              </li>
              <li>
                <Link to="/earthquake-by-region" className="text-techtoniq-earth hover:text-techtoniq-blue">Earthquakes by Region</Link>
              </li>
              <li>
                <Link to="/safety-guidelines" className="text-techtoniq-earth hover:text-techtoniq-blue">Safety Guidelines</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-techtoniq-earth-dark">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/emergency-contacts" className="text-techtoniq-earth hover:text-techtoniq-blue">Emergency Contacts</Link>
              </li>
              <li>
                <Link to="/emergency-resources" className="text-techtoniq-earth hover:text-techtoniq-blue">Emergency Resources</Link>
              </li>
              <li>
                <Link to="/volunteer-opportunities" className="text-techtoniq-earth hover:text-techtoniq-blue">Volunteer</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-techtoniq-earth hover:text-techtoniq-blue">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-techtoniq-earth-dark">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/educational-materials" className="text-techtoniq-earth hover:text-techtoniq-blue">Educational Materials</Link>
              </li>
              <li>
                <Link to="/latest-news" className="text-techtoniq-earth hover:text-techtoniq-blue">Latest News</Link>
              </li>
              <li>
                <Link to="/educational-materials#glossary" className="text-techtoniq-earth hover:text-techtoniq-blue">Glossary of Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-techtoniq-earth/10 pt-6 text-center text-xs text-techtoniq-earth">
          <p>© {new Date().getFullYear()} Techtoniq. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-techtoniq-blue">Privacy Policy</a> | 
            <a href="#" className="ml-2 hover:text-techtoniq-blue">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
