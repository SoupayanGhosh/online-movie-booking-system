"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import { FeaturedMovie } from "@/components/featured-movie"
import React from "react"

interface Movie {
  id: string
  title: string
  image: string
  rating: number
  genre: string
  duration: string
}

type MovieParams = {
  movieId: string
}

type PageProps = {
  params: MovieParams
}

// Sample movie data with local images
const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Dune: Part Two",
    image: "/dune 2.jpg",
    rating: 4.8,
    genre: "Sci-Fi",
    duration: "2h 46m"
  },
  {
    id: "2",
    title: "Oppenheimer",
    image: "/opp.jpg",
    rating: 4.7,
    genre: "Drama",
    duration: "3h 0m"
  },
  {
    id: "3",
    title: "The Batman",
    image: "/batman.jpg",
    rating: 4.5,
    genre: "Action",
    duration: "2h 56m"
  },
  {
    id: "4",
    title: "Deadpool",
    image: "/dp.jpg",
    rating: 4.6,
    genre: "Action",
    duration: "2h 7m"
  },
  {
    id: "5",
    title: "Kong: Skull Island",
    image: "/kong.jpg",
    rating: 4.3,
    genre: "Adventure",
    duration: "1h 58m"
  },
  {
    id: "6",
    title: "Inside Out",
    image: "/inside.jpg",
    rating: 4.4,
    genre: "Animation",
    duration: "1h 42m"
  },
  {
    id: "7",
    title: "A Quiet Place",
    image: "/quiet.jpg",
    rating: 4.5,
    genre: "Horror",
    duration: "1h 30m"
  }
]

export default function Home({ params }: PageProps) {
  // Unwrap params if it's a Promise (for future Next.js compatibility)
  // (This is a no-op for now, but will be required in future Next.js versions)
  // @ts-expect-error: params may be a Promise in future Next.js versions
  const unwrappedParams = typeof params?.then === 'function' ? React.use(params) : params;

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call with local data
    setLoading(true)
    setError(null)
    
    // Simulate network delay
    setTimeout(() => {
      try {
        setMovies(sampleMovies)
      } catch (err) {
        setError('Failed to load movies')
      } finally {
        setLoading(false)
      }
    }, 1000)
  }, [])

  if (loading) return <div className="p-8 text-center">Loading movies...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  // Use the first movie as featured movie, or null if no movies
  const featuredMovie = movies.length > 0 ? movies[0] : null

  return (
    <main className="min-h-screen">
      {/* Hero Section with Featured Movie */}
      <section className="relative">
        <FeaturedMovie movie={featuredMovie} />
      </section>

      {/* Now Showing Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold neon-green-glow">Now Showing</h2>
          <Button variant="outline" className="hover:text-neon-blue hover:border-neon-blue">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice(0, 4).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="container mx-auto py-12 px-4 gradient-bg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Coming Soon</h2>
          <Button variant="outline" className="hover:text-neon-blue hover:border-neon-blue">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice(4).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="gradient-bg rounded-lg p-8 text-center border border-gray-800">
          <h2 className="text-3xl font-bold mb-4 neon-blue-glow">Special Offers</h2>
          <p className="text-lg mb-6">
            Get 20% off on all movie tickets every Tuesday! Sign up for our loyalty program for exclusive deals.
          </p>
          <Button size="lg" className="button-neon-green">
            Join Now
          </Button>
        </div>
      </section>
    </main>
  )
}