"use client";

import React, { useEffect, useState } from "react";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState([]);
  useEffect(() => {
    fetch("/api/cinemas")
      .then((res) => res.json())
      .then(setCinemas);
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Cinemas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cinemas.map((cinema: any) => (
          <div key={cinema._id} className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">{cinema.name}</h2>
            <p className="text-gray-600">{cinema.location}</p>
            <p className="text-gray-500">Screens: {cinema.screens}</p>
            {cinema.description && <p className="text-gray-400">{cinema.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
