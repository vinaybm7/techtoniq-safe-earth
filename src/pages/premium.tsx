import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Link } from "react-router-dom";

const Premium = () => {
  return (
    <PageLayout>
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Shield className="mx-auto h-12 w-12 text-techtoniq-blue mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-techtoniq-earth-dark sm:text-4xl">
              Premium Subscription
            </h1>
            <p className="mt-2 text-lg text-techtoniq-earth">
              Upgrade to Premium for enhanced earthquake monitoring and safety features
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-techtoniq-earth-dark">
                  Premium Features
                </h2>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-techtoniq-blue" />
                    <span className="text-techtoniq-earth-dark">Real-time earthquake alerts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-techtoniq-blue" />
                    <span className="text-techtoniq-earth-dark">Advanced prediction analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-techtoniq-blue" />
                    <span className="text-techtoniq-earth-dark">Priority customer support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-techtoniq-blue" />
                    <span className="text-techtoniq-earth-dark">Custom safety plans</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-techtoniq-earth-dark">
                  Choose Your Plan
                </h2>
                <div className="mt-6">
                  <Button asChild className="w-full bg-techtoniq-blue hover:bg-techtoniq-blue-dark">
                    <Link to="/subscribe">
                      Start Free Trial
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Premium;
