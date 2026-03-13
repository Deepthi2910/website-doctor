<<<<<<< HEAD
=======
"use client";

>>>>>>> 80365d441e2c6bed578a07aa31c847d067e6b3bd
import { Suspense } from "react";
import ReportContent from "./ReportContent";

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}