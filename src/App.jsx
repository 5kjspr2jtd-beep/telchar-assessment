import { Routes, Route, useSearchParams } from "react-router-dom";
import TelcharLandingPage from "./pages/TelcharLandingPage";
import TelcharAssessment from "./pages/TelcharAssessment";
import ROICalculator from "./ROICalculator";

function RootRoute() {
  const [searchParams] = useSearchParams();
  if (searchParams.get("page") === "roi") return <ROICalculator />;
  return <TelcharLandingPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/assessment" element={<TelcharAssessment />} />
    </Routes>
  );
}
