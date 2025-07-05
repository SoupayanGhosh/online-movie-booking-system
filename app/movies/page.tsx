"use client";

import React, { useEffect, useState } from "react";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then(setMovies);
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movies.map((movie: any) => (
          <div key={movie._id} className="bg-white rounded shadow p-4">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded mb-2" />
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-gray-600">{movie.genre.join(", ")}</p>
            <p className="text-gray-500">{movie.description}</p>
            <p className="text-sm text-gray-400">Release: {new Date(movie.releaseDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
