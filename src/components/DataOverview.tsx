
import { AlertCircle, AlertTriangle, ArrowRight, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const DataOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-techtoniq-blue-light/30 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-techtoniq-blue" />
            <h3 className="font-medium text-techtoniq-earth-dark">Recent Activity</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-techtoniq-teal"></span>
                <span className="text-sm">Alaska, USA</span>
              </div>
              <span className="text-sm font-medium">4.2</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-techtoniq-warning"></span>
                <span className="text-sm">Tokyo, Japan</span>
              </div>
              <span className="text-sm font-medium">5.1</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-techtoniq-alert"></span>
                <span className="text-sm">Santiago, Chile</span>
              </div>
              <span className="text-sm font-medium">6.7</span>
            </div>
          </div>
          <Button asChild variant="ghost" className="mt-4 w-full justify-between">
            <Link to="/real-time-data">
              <span>View all activity</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-techtoniq-blue-light/30 p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-techtoniq-blue" />
            <h3 className="font-medium text-techtoniq-earth-dark">Global Statistics</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-xs text-techtoniq-earth">Past Week</p>
                <p className="text-xl font-semibold text-techtoniq-earth-dark">212</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-xs text-techtoniq-earth">Past Month</p>
                <p className="text-xl font-semibold text-techtoniq-earth-dark">893</p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-techtoniq-earth">Significant Events (M6+)</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-semibold text-techtoniq-earth-dark">8</p>
                <span className="text-xs text-techtoniq-alert">+2 from last month</span>
              </div>
            </div>
          </div>
          <Button asChild variant="ghost" className="mt-4 w-full justify-between">
            <Link to="/earthquake-statistics">
              <span>View statistics</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-techtoniq-blue-light/30 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-techtoniq-blue" />
            <h3 className="font-medium text-techtoniq-earth-dark">Safety Status</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4 rounded-lg bg-techtoniq-teal-light p-3">
            <p className="text-sm font-medium text-techtoniq-teal-dark">No current alerts</p>
            <p className="mt-1 text-xs text-techtoniq-earth">Last updated: Today, 10:45 AM</p>
          </div>
          <p className="text-sm text-techtoniq-earth">Stay prepared and review your emergency plan regularly.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/safety-guidelines">Safety Tips</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/emergency-resources">Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;
