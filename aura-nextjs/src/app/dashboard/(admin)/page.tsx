import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ui/dashboard/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ui/dashboard/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ui/dashboard/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ui/dashboard/ecommerce/StatisticsChart";
import TopProduct from "@/components/ui/dashboard/ecommerce/TopProduct";
import DemographicCard from "@/components/ui/dashboard/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "Aura-Admin",
  description: "This is dashboard page for Aura admins",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <TopProduct />
      </div>
    </div>
  );
}
