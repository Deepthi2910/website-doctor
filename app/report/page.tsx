import { Suspense } from "react";
import ReportContent from "./ReportContent";

export default function ReportPage() {
  return (
    <Suspense fallback={<div>Loading report...</div>}>
      <ReportContent />
    </Suspense>
  );
}