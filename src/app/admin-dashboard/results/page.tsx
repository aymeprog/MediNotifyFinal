"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

export default function ResultsPage() {
  const [patientName, setPatientName] = useState("");
  const [testType, setTestType] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      const resultsRef = collection(db, "results");
      const snapshot = await getDocs(resultsRef);
      setResults(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchResults();
  }, []);

  // Upload new result
  const handleUpload = async () => {
    if (!patientName || !testType || !file) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const fileRef = ref(storage, `results/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, "results"), {
        patientName,
        testType,
        remarks,
        fileURL: downloadURL,
        status: "Completed",
        uploadDate: new Date().toISOString(),
      });

      toast.success("Result uploaded successfully!");
      setPatientName("");
      setTestType("");
      setRemarks("");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Error uploading result.");
    }
  };

  // Filter results
  const filteredResults = results.filter(
    (r) =>
      r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      r.testType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#4A7C59]">
        Results Management
      </h1>

      {/* Upload Form */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Upload Laboratory Result</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Test Type (e.g., CBC, Blood Chem)"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="border rounded-lg p-2"
          />
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="Remarks or Interpretation (optional)"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>

        <button
          onClick={handleUpload}
          className="mt-4 bg-[#4A7C59] text-white px-6 py-2 rounded-lg hover:bg-[#3A6248]"
        >
          Upload Result
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Uploaded Results</h2>
        <input
          type="text"
          placeholder="Search by Patient or Test Type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-72"
        />
      </div>

      {/* Results Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#4A7C59] text-white">
            <tr>
              <th className="p-3">Patient Name</th>
              <th className="p-3">Test Type</th>
              <th className="p-3">Upload Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{r.patientName}</td>
                <td className="p-3">{r.testType}</td>
                <td className="p-3">
                  {new Date(r.uploadDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      r.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <a
                    href={r.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <button className="text-[#4A7C59] hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredResults.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
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
