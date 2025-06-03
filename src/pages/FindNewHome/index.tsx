"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Pagination from "@/components/Pagination/Pagination";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import { useNavigate } from "react-router-dom";

// Define types for our data
interface AdopterProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation?: string;
  imageUrl: string;
  verified?: boolean;
}

// Sample data
const profiles: AdopterProfile[] = [
  {
    id: "1",
    name: "Tienxinh",
    age: 24,
    location: "Hà Nội",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
  },
  {
    id: "2",
    name: "MinhLuân",
    age: 28,
    location: "Hồ Chí Minh",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
  },
  {
    id: "3",
    name: "Siriana Pham",
    age: 26,
    location: "Đà Nẵng",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
  },
  {
    id: "4",
    name: "Duongmau",
    age: 30,
    location: "Hà Nội",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
  },
  {
    id: "5",
    name: "Duongvui",
    age: 25,
    location: "Hồ Chí Minh",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
  },
  {
    id: "6",
    name: "Anhcutic",
    age: 27,
    location: "Đà Nẵng",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
  },
];

export default function FindNewHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const navigate = useNavigate();

  // Filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: "sortFilter",
      placeholder: "Sắp xếp",
      value: filter,
      onChange: setFilter,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "newest", label: "Mới nhất", value: "newest" },
        { id: "recent", label: "Gần đây", value: "recent" },
      ],
    },
    {
      id: "ageFilter",
      placeholder: "Độ tuổi",
      value: ageFilter,
      onChange: setAgeFilter,
      options: [
        { id: "all", label: "Mọi người", value: "all" },
        { id: "18-25", label: "18-25 tuổi", value: "18-25" },
        { id: "26-35", label: "26-35 tuổi", value: "26-35" },
        { id: "36+", label: "36+ tuổi", value: "36+" },
      ],
    },
    {
      id: "locationFilter",
      placeholder: "Địa điểm",
      value: locationFilter,
      onChange: setLocationFilter,
      options: [
        { id: "all", label: "Mọi địa điểm", value: "all" },
        { id: "hanoi", label: "Hà Nội", value: "hanoi" },
        { id: "hcm", label: "Hồ Chí Minh", value: "hcm" },
        { id: "danang", label: "Đà Nẵng", value: "danang" },
      ],
    },
  ];

  // Filtered profiles
  const filteredProfiles = profiles.filter((profile) => {
    if (
      locationFilter !== "all" &&
      !profile.location.toLowerCase().includes(locationFilter.toLowerCase())
    )
      return false;

    if (ageFilter !== "all") {
      const [min, max] = ageFilter.includes("+")
        ? [parseInt(ageFilter), 100]
        : ageFilter.split("-").map(Number);

      if (profile.age < min || profile.age > (max || 100)) return false;
    }

    return true;
  });

  // Pagination logic
  const profilesPerPage = 6;
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tìm nhà mới cho bé" },
  ];

  // Navigate to profile detail
  const handleProfileDetail = (id: string) => {
    // Use navigate from react-router-dom instead of window.location
    // This prevents full page reload
    navigate(`/find-new-home/${id}`);
    // The Button in Card will handle navigation with Link
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto py-6">
        {/* Header and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <Filter filters={filterConfigs} className="mt-4 md:mt-0" />
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentProfiles.map((profile) => (
            <div
              key={profile.id}
              className="transform transition-transform hover:scale-[0.98]"
            >
              <Card
                type="person"
                image={profile.imageUrl}
                title={profile.name}
                gender={`${profile.age} tuổi`}
                location={profile.location}
                area={profile.occupation || ""}
                badge={profile.verified ? "✓" : ""}
                buttonText="Xem chi tiết"
                onButtonClick={() => handleProfileDetail(profile.id)}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 mb-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
