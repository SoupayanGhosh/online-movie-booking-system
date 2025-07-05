"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Movie {
  id: string
  title: string
  image: string
  rating: number
  genre: string
  duration: string
  description: string
  showtimes?: Array<{
    date: string
    showtimes: Array<{
      time: string
      theaterId: string
    }>
  }>
}

interface MovieParams {
  movieId: string
}

interface BookingPageProps {
  params: MovieParams
}

interface Theater {
  id: string
  name: string
}

export default function BookingPage({ params }: BookingPageProps) {
  // Unwrap params if it's a Promise (for future Next.js compatibility)
  // @ts-expect-error: params may be a Promise in future Next.js versions
  const unwrappedParams = typeof params?.then === 'function' ? React.use(params) : params;
  // Use type assertion to help TypeScript
  const { movieId } = unwrappedParams as MovieParams;
  
  const [movie, setMovie] = React.useState<Movie | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)
  const [selectedTheater, setSelectedTheater] = React.useState<string | null>(null)

  React.useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Movie not found")
        return res.json()
      })
      .then((data) => {
        setMovie({
          id: data._id || data.id,
          title: data.title,
          image: data.image || data.posterUrl || "/placeholder.svg",
          rating: data.rating,
          genre: data.genre,
          duration: data.duration,
          description: data.description || "",
          showtimes: data.showtimes || []
        })
        // Set initial selected date to the first available date
        if (data.showtimes && data.showtimes.length > 0) {
          setSelectedDate(data.showtimes[0].date)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [movieId])

  const theaters: Theater[] = [
    { id: "1", name: "CineTix IMAX - Downtown" },
    { id: "2", name: "CineTix Multiplex - Westside" },
    { id: "3", name: "CineTix Premiere - Eastgate" },
  ]

  // Get available dates from movie showtimes
  const dates = movie?.showtimes || []

  // Get showtimes for selected date and theater
  const availableShowtimes = React.useMemo(() => {
    if (!selectedDate || !movie?.showtimes) return []
    const dateShowtimes = movie.showtimes.find(d => d.date === selectedDate)
    if (!dateShowtimes) return []
    return selectedTheater
      ? dateShowtimes.showtimes.filter(st => st.theaterId === selectedTheater)
      : dateShowtimes.showtimes
  }, [movie?.showtimes, selectedDate, selectedTheater])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading movie details...</div>
  if (error || !movie) return <div className="p-8 text-center text-red-500">{error || "Movie not found"}</div>

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Movie Poster */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image src={movie.image || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
          </div>
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4 neon-green-glow">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-sm">
              {movie.rating} ★
            </span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{movie.genre}</span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{movie.duration}</span>
          </div>
          <p className="text-muted-foreground mb-6">{movie.description}</p>

          <h2 className="text-xl font-semibold mb-4">Select Date</h2>
          <div className="flex overflow-x-auto gap-2 pb-4 mb-6">
            {dates.map((date) => (
              <Card
                key={date.date}
                className={cn(
                  "min-w-[100px] cursor-pointer transition-colors bg-gray-900 border-gray-800",
                  selectedDate === date.date && "border-neon-green"
                )}
                onClick={() => setSelectedDate(date.date)}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-medium">{formatDate(date.date)}</div>
                  <div className="text-sm text-muted-foreground">{
                    new Date(date.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Select Theater</h2>
          <Tabs 
            value={selectedTheater || theaters[0].id} 
            onValueChange={setSelectedTheater}
            className="mb-6"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {theaters.map((theater) => (
                <TabsTrigger key={theater.id} value={theater.id}>
                  {theater.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {theaters.map((theater) => (
              <TabsContent key={theater.id} value={theater.id}>
                <h3 className="text-lg font-medium mb-3">{theater.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availableShowtimes
                    .filter(st => st.theaterId === theater.id)
                    .map((showtime, idx) => (
                      <Link
                        key={`${showtime.time}-${idx}`}
                        href={`/booking/${movieId}/seats?theater=${theater.id}&showtime=${showtime.time}&date=${selectedDate}`}
                      >
                        <Button variant="outline" className="w-full hover:text-neon-green hover:border-neon-green">
                          {showtime.time}
                        </Button>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </main>
  )
}

