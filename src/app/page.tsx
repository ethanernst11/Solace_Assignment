"use client";

import { useEffect, useState, type ChangeEvent } from "react";

type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    console.log("Fetching advocates...");
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const data = jsonResponse.data as Advocate[];
        setAdvocates(data);
        setFilteredAdvocates(data);
      });
  }, []);

  // Handle typing
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle Enter key press
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchClick();
    }
  };

  // Perform search only when button (or Enter) is pressed
  const onSearchClick = async () => {
    if (!searchTerm.trim()) {
      setFilteredAdvocates(advocates);
      return;
    }

    try {
      setLoading(true);
      console.log("Searching advocates via API...");
      const response = await fetch(`/api/advocates?searchTerm=${encodeURIComponent(searchTerm)}`);
      const jsonResponse = await response.json();
      setFilteredAdvocates(jsonResponse.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset search
  const onResetClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 font-sans">
      <h1 className="text-5xl font-semibold mb-6">Solace Advocates</h1>
      <section className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-10">
        <label htmlFor="search" className="text-lg text-gray-700">
          Search
        </label>

        <p className="text-lg text-gray-600 mt-1">
          Searching for: <span className="font-semibold">{searchTerm}</span>
        </p>

        <div className="flex gap-3 mt-3">
          <input
            id="search"
            value={searchTerm}
            placeholder="Type to search..."
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            onClick={onSearchClick}
            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={onResetClick}
            className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-300"
          >
            Reset
          </button>
        </div>

        {loading && (
          <p className="text-gray-500 text-sm mt-3">Searching...</p>
        )}
      </section>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border border-gray-300 p-3 text-lg">First Name</th>
              <th className="border border-gray-300 p-3 text-lg">Last Name</th>
              <th className="border border-gray-300 p-3 text-lg">City</th>
              <th className="border border-gray-300 p-3 text-lg">Degree</th>
              <th className="border border-gray-300 p-3 text-lg">Specialties</th>
              <th className="border border-gray-300 p-3 text-lg">Experience (Years)</th>
              <th className="border border-gray-300 p-3 text-lg">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.length > 0 ? (
              filteredAdvocates.map((advocate) => (
                <tr
                  key={advocate.id}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="p-3 text-lg">{advocate.firstName}</td>
                  <td className="p-3 text-lg">{advocate.lastName}</td>
                  <td className="p-3 text-lg">{advocate.city}</td>
                  <td className="p-3 text-lg">{advocate.degree}</td>
                  <td className="p-3 text-lg">{advocate.specialties.join(" || ")}</td>
                  <td className="p-3 text-lg">{advocate.yearsOfExperience}</td>
                  <td className="p-3 text-lg">{advocate.phoneNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No advocates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
