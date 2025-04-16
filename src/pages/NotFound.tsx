import { AlertTriangle, Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <div className="animate-pulse-slow mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-techtoniq-blue-light">
          <AlertTriangle className="h-12 w-12 text-techtoniq-blue" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-techtoniq-earth-dark">404</h1>
        <p className="mb-8 text-xl text-techtoniq-earth">
          Oops! The page you're looking for can't be found.
        </p>
        <p className="mb-12 max-w-md text-techtoniq-earth">
          The page at <span className="font-mono text-techtoniq-earth-dark">{location.pathname}</span> doesn't exist.
          It might have been moved, deleted, or perhaps it never existed at all.
        </p>
        <Button asChild className="flex items-center gap-2 bg-techtoniq-blue hover:bg-techtoniq-blue-dark">
          <Link to="/">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
