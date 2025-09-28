"use client";

import { DashboardNav } from "@/components/dietician";

export default function PatientManagement() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-20">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#7A5C3A] mb-4">
            Patient Management
          </h1>
          <p className="text-lg text-[#7A5C3A]/70">
            रोगी प्रबंधन - Manage your patients efficiently
          </p>
        </div>
      </div>
    </div>
  );
}
