import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <Header />
      <div className="flex flex-col bg-[#FFEDFA] px-20">
        {/* Main content area */}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
