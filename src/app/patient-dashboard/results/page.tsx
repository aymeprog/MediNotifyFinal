"use client";

import { useEffect, useState } from "react";
import { db, auth, storage } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { Download, Filter } from "lucide-react";

type Result = {
  id: string;
  patientID: string;
  testName: string;
  date: string;
  resultValue: string;
  remarks: string;
  pdfPath?: string;
};

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [filterType, setFilterType] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  useEffect(() => {
    const fetchResults = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "results"),
          where("patientID", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const list: Result[] = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let downloadUrl = "";

            // If PDF exists, fetch the Firebase Storage URL
            if (data.pdfPath) {
              try {
                const fileRef = ref(storage, data.pdfPath);
                downloadUrl = await getDownloadURL(fileRef);
              } catch (e) {
                console.warn("PDF file not found for:", data.pdfPath);
              }
            }

            return {
              id: doc.id,
              patientID: data.patientID,
              testName: data.testName,
              date: data.date instanceof Timestamp
                ? data.date.toDate().toISOString().split("T")[0]
                : data.date,
              resultValue: data.resultValue,
              remarks: data.remarks,
              pdfPath: downloadUrl,
            };
          })
        );

        setResults(list);
        setFilteredResults(list);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  // Filter by test type and date range
  const handleFilter = () => {
    let filtered = [...results];

    if (filterType !== "All") {
      filtered = filtered.filter((r) => r.testName === filterType);
    }

    if (dateFrom) {
      filtered = filtered.filter((r) => r.date >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((r) => r.date <= dateTo);
    }

    setFilteredResults(filtered);
  };

  const testTypes = Array.from(new Set(results.map((r) => r.testName)));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md">
      <h1 className="text-2xl font-bold text-[#4A7C59] mb-6">Lab Results</h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="text-sm font-semibold text-gray-600">Test Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="ml-2 border rounded-lg px-3 py-2"
          >
            <option value="All">All</option>
            {testTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="ml-2 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="ml-2 border rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={handleFilter}
          className="flex items-center gap-2 bg-[#4A7C59] text-white px-4 py-2 rounded-lg hover:bg-[#3b654a] transition-all"
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E8F0EC] text-gray-700">
              <th className="py-3 px-4">Test Name</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Result</th>
              <th className="py-3 px-4">Remarks</th>
              <th className="py-3 px-4 text-center">PDF</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="py-3 px-4">{result.testName}</td>
                  <td className="py-3 px-4">{result.date}</td>
                  <td className="py-3 px-4">{result.resultValue}</td>
                  <td className="py-3 px-4">{result.remarks}</td>
                  <td className="py-3 px-4 text-center">
                    {result.pdfPath ? (
                      <a
                        href={result.pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4A7C59] hover:text-[#3b654a] flex items-center justify-center"
                      >
                        <Download size={20} />
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No PDF</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
