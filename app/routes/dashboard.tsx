import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Chip, 
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Tooltip
} from "@heroui/react";
import type { RadiosResponse } from "~/types";
import { api } from "~/providers/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"newest" | "alphabetical" | "size">("newest");

  // Fetch radio stations
  const { data: radios, isLoading, error, refetch } = useQuery({
    queryKey: ["radios"],
    queryFn: async () => {
      const response = await api.get<RadiosResponse>("/radios");
      return response.data;
    }
  });

  // Sort radios based on the selected option
  const sortedRadios = radios ? [...radios].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "size":
        return b.blockCount - a.blockCount;
      case "newest":
      default:
        // Assuming newer radios have larger IDs (not ideal but works for demo)
        return b.id.localeCompare(a.id);
    }
  }) : [];

  // Handle radio click
  const handleRadioClick = (radioId: string) => {
    navigate(`/radio/${radioId}`);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Radio Stations</h1>
            <p className="text-gray-600 mt-1">Manage and play your custom radio stations</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="flat" 
                  color="default"
                >
                  Sort: {sortBy === "newest" ? "Newest" : sortBy === "alphabetical" ? "A-Z" : "Size"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Sort options"
                onAction={(key) => setSortBy(key as "newest" | "alphabetical" | "size")}
              >
                <DropdownItem key="newest">Newest</DropdownItem>
                <DropdownItem key="alphabetical">Alphabetical (A-Z)</DropdownItem>
                <DropdownItem key="size">Size (# of tracks)</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            
            <Button 
              color="primary" 
              onPress={() => navigate("/create")}
            >
              Create New Station
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-medium">Error loading radio stations</p>
            <p className="text-sm">{(error as Error).message || "Unknown error occurred"}</p>
            <Button 
              size="sm" 
              color="danger" 
              variant="flat" 
              className="mt-2" 
              onPress={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <Spinner size="lg" label="Loading radio stations..." color="primary" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && radios && radios.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300 shadow-none">
            <CardBody className="py-12 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">📻</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No radio stations yet</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Create your first radio station to get started. Add YouTube links and customize your station.
              </p>
              <Button 
                color="primary" 
                size="lg"
                onPress={() => navigate("/create")}
              >
                Create Your First Station
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Radio station grid */}
        {!isLoading && sortedRadios && sortedRadios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRadios.map((radio) => (
              <Card 
                key={radio.id}
                className=""
              >
                <CardHeader className="flex flex-col items-start">
                  <div className="flex justify-between w-full items-start">
                    <h2 className="text-xl font-bold line-clamp-1">{radio.title}</h2>
                    <Chip 
                      color={radio.is_public ? "success" : "default"} 
                      variant="flat" 
                      size="sm"
                    >
                      {radio.is_public ? "Public" : "Private"}
                    </Chip>
                  </div>
                </CardHeader>
                
                <Divider />
                
                <CardBody 
                  className="cursor-pointer" 
                  onClick={() => handleRadioClick(radio.id)}
                >
                  {radio.description ? (
                    <p className="text-gray-600 line-clamp-2">{radio.description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description</p>
                  )}
                </CardBody>
                
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {radio.blockCount} track{radio.blockCount !== 1 ? "s" : ""}
                  </div>
                  
                  <Tooltip content="Play this station">
                    <Button 
                      color="primary" 
                      variant="flat" 
                      size="sm" 
                      isIconOnly
                      onPress={() => handleRadioClick(radio.id)}
                    >
                      ▶️
                    </Button>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
