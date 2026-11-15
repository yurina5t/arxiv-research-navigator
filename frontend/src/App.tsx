import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DEFAULT_FILTERS } from "./data/demo";
import { HomePage } from "./pages/HomePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import type { SearchFilters } from "./types";

export default function App() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage filters={filters} onChange={setFilters} />}
      />
      <Route
        path="/workspace"
        element={<WorkspacePage filters={filters} onChange={setFilters} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
