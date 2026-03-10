import { Routes, Route, useSearchParams, Navigate } from "react-router-dom";
import TelcharLandingPage from "./pages/TelcharLandingPage";
import TelcharAssessment from "./pages/TelcharAssessment";
import TelcharReport from "./pages/TelcharReport";
import ROICalculator from "./ROICalculator";
import TelcharImplementation from "./pages/TelcharImplementation";

function RootRoute() {
  const [searchParams] = useSearchParams();
  if (searchParams.get("page") === "roi") return <ROICalculator />;
  return <TelcharLandingPage />;
}

function ReportRoute() {
  const [searchParams] = useSearchParams();
  const tier = searchParams.get("tier") || "free";
  const demo = searchParams.get("demo") === "true";

  // Guard: if not demo mode and no session data, redirect to assessment
  if (!demo) {
    try {
      const saved = sessionStorage.getItem("telchar_assessment_data");
      if (!saved) return <Navigate to="/assessment" replace />;
    } catch (e) {
      return <Navigate to="/assessment" replace />;
    }
  }

  return <TelcharReport initialTier={tier} demo={demo} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/assessment" element={<TelcharAssessment />} />
      <Route path="/report" element={<ReportRoute />} />
      <Route path="/apply" element={<TelcharImplementation />} />
    </Routes>
  );
}
