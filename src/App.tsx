import { useState } from "react";
import "@/styles/global.css";
import RouterComponent from "./routes";
import { useAuth } from "./hooks/useAuth";

function App() {
  useAuth();
  return <RouterComponent />;
}

export default App;
