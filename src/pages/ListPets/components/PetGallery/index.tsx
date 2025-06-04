import { useState, useEffect } from "react";
import { PetCard } from "../PetCard";
import PageHeader from "@/components/ContentHeader/ContentHeader";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./pet-gallery.module.css";
import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";
import { Pet, PetCardData } from "@/types/Pet";

export default function PetGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [petType, setPetType] = useState("all");
  const [age, setAge] = useState("all");
  const [gender, setGender] = useState("all");
  const [pageSize] = useState(6);

  // Add state for pets data
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [displayPets, setDisplayPets] = useState<Pet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: "petType",
      placeholder: "Loại",
      value: petType,
      onChange: setPetType,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "1", label: "Chó", value: "1" },
        { id: "2", label: "Mèo", value: "2" },
      ],
    },
    {
      id: "age",
      placeholder: "Tuổi",
      value: age,
      onChange: setAge,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "puppy", label: "< 12 tháng", value: "puppy" },
        { id: "adult", label: "≥ 12 tháng", value: "adult" },
      ],
    },
    {
      id: "gender",
      placeholder: "Giới tính",
      value: gender,
      onChange: setGender,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "male", label: "Đực", value: "Đực" },
        { id: "female", label: "Cái", value: "Cái" },
      ],
    },
  ];

  // Function to fetch all pets from the API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);

        // Log the environment variable to check the base URL
        console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);
        console.log("Endpoint being used:", API_ENDPOINT.PET.LIST);

        // Build filter params - only include filters, no pagination
        const params: Record<string, any> = {};

        // Only add filter params if they're not "all"
        if (petType !== "all") {
          params.categoryId = parseInt(petType);
        }

        if (age === "puppy") {
          params.ageMax = 11;
        } else if (age === "adult") {
          params.ageMin = 12;
        }

        if (gender !== "all") {
          params.gender = gender;
        }

        console.log("Request params:", params);

        // Make the API call without pagination params
        const response = await axiosClient.get(API_ENDPOINT.PET.LIST, {
          params,
        });

        console.log("Full API response:", response);

        // Extract pets from the response format
        let pets: Pet[] = [];
        let totalItems = 0;

        // Handle the specific response format from your API
        if (response.data && response.data.success) {
          // The API returns { statusCode, success, message, data: { items: Pet[], totalCount, pageNumber, pageSize }, detailErrors }
          if (response.data.data && Array.isArray(response.data.data.items)) {
            pets = response.data.data.items;
            totalItems = response.data.data.totalCount || pets.length;
            console.log(
              `Found ${pets.length} pets in response.data.data.items`
            );
          } else {
            console.error(
              "Response data.data.items is not an array:",
              response.data
            );
            throw new Error("Invalid response format");
          }
        } else if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          // Legacy format: { statusCode, success, message, data: Pet[], detailErrors }
          pets = response.data.data;
          totalItems = pets.length;
          console.log(`Found ${pets.length} pets in response.data.data`);
        } else if (Array.isArray(response.data)) {
          // Direct array response
          pets = response.data;
          totalItems = pets.length;
        } else if (
          response.data &&
          response.data.content &&
          Array.isArray(response.data.content)
        ) {
          // Paginated response format
          pets = response.data.content;
          totalItems = response.data.totalElements || pets.length;
        } else {
          // Enhanced error handling for unexpected formats
          console.error("Unexpected response format:", response.data);

          // Try to extract pets using a more flexible approach
          try {
            // Log entire response structure for debugging
            console.log(
              "Response structure:",
              JSON.stringify(response, null, 2)
            );

            // Try to find arrays in the response at various levels
            const findPetsArray = (obj: any): Pet[] | null => {
              // If the object itself is an array, return it
              if (Array.isArray(obj)) {
                return obj.length > 0 && obj[0].petId ? obj : null;
              }

              // Look for array properties that might contain pets
              for (const key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                  // Check if this property is an array that looks like pets
                  if (
                    Array.isArray(obj[key]) &&
                    obj[key].length > 0 &&
                    obj[key][0].petId
                  ) {
                    return obj[key];
                  }

                  // Recursively check nested objects
                  const result = findPetsArray(obj[key]);
                  if (result) return result;
                }
              }
              return null;
            };

            const foundPets = findPetsArray(response.data);
            if (foundPets && foundPets.length > 0) {
              console.log(
                "Found pets using flexible search:",
                foundPets.length
              );
              pets = foundPets;
              totalItems = foundPets.length;
            } else {
              // If all else fails, create fake data as a fallback for UI testing
              console.warn("Creating fallback pets data for UI");
              pets = [];
              totalItems = 0;
              throw new Error("Could not extract pets data from response");
            }
          } catch (parseError) {
            console.error("Error parsing response:", parseError);
            throw new Error("Invalid response format: " + parseError.message);
          }
        }

        // Update state with all fetched pets
        setAllPets(pets);
        setFilteredPets(pets);

        // Calculate total pages based on the total count and page size
        setTotalPages(Math.max(1, Math.ceil(totalItems / pageSize)));

        // Update display pets for current page
        updateDisplayPets(pets, currentPage, pageSize);
      } catch (err: any) {
        console.error("Error fetching pets:", err);
        // Add more detailed error logging
        if (err.request) {
          console.error("Request was made but no response received");
        }

        if (err.config) {
          console.error("Request details:", {
            url: err.config?.url,
            baseURL: err.config?.baseURL,
            method: err.config?.method,
            params: JSON.stringify(err.config?.params),
            fullUrl: `${err.config?.baseURL}${err.config?.url}`,
          });
        }

        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);

          // If we received some data, try to use it even if format is unexpected
          if (err.response.data && typeof err.response.data === "object") {
            try {
              const emergencyExtract = (obj: any): Pet[] => {
                // Deep scan the object for arrays that could be pets
                const scan = (o: any, path: string = ""): Pet[] | null => {
                  if (
                    Array.isArray(o) &&
                    o.length > 0 &&
                    (o[0].petId || o[0].petName)
                  ) {
                    console.log(`Found potential pets array at ${path}`);
                    return o;
                  }

                  if (typeof o === "object" && o !== null) {
                    for (const key in o) {
                      const result = scan(o[key], `${path}.${key}`);
                      if (result) return result;
                    }
                  }
                  return null;
                };

                return scan(obj) || [];
              };

              const rescuedPets = emergencyExtract(err.response.data);
              if (rescuedPets.length > 0) {
                console.log(
                  "Rescued pets from error response:",
                  rescuedPets.length
                );
                setAllPets(rescuedPets);
                setFilteredPets(rescuedPets);
                setDisplayPets(rescuedPets.slice(0, pageSize));
                setTotalPages(
                  Math.max(1, Math.ceil(rescuedPets.length / pageSize))
                );
                return; // Exit early since we recovered
              }
            } catch (rescueError) {
              console.error("Failed emergency data extraction:", rescueError);
            }
          }
        }

        // If we reach here, all recovery attempts failed
        setError("Không thể tải danh sách thú cưng. Vui lòng thử lại sau.");
        setAllPets([]);
        setFilteredPets([]);
        setDisplayPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [petType, age, gender]); // Remove currentPage and pageSize from dependencies

  // Function to update displayed pets based on current page
  const updateDisplayPets = (pets: Pet[], page: number, size: number) => {
    const startIndex = (page - 1) * size;
    const endIndex = Math.min(startIndex + size, pets.length);
    setDisplayPets(pets.slice(startIndex, endIndex));
  };

  // Handler for page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update displayed pets when page changes
    updateDisplayPets(filteredPets, page, pageSize);
    window.scrollTo(0, 0);
  };

  // Update display pets when currentPage changes
  useEffect(() => {
    updateDisplayPets(filteredPets, currentPage, pageSize);
  }, [currentPage, filteredPets, pageSize]);

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Làm quen với các bé" />
        <Filter filters={filterConfigs} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">
            Không tìm thấy thú cưng nào phù hợp với bộ lọc.
          </p>
          <p className="mt-2">Vui lòng thử với các tiêu chí khác.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {displayPets.map((pet) => (
              <PetCard
                key={pet.petId}
                pet={{
                  id: pet.petId,
                  name: pet.petName,
                  gender: pet.gender,
                  location: pet.location || "Không xác định",
                  status: pet.age < 12 ? "Chưa trưởng thành" : "Trưởng thành",
                  imageUrl: pet.petImageUrls || "",
                  categoryName: pet.categoryName,
                  slug: pet.slug,
                }}
              />
            ))}
          </div>

          {filteredPets.length > pageSize && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
