"use client"

import React from "react"
import Link from "next/link"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, Download, Share2, Ticket, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatShowDate, formatShowTime } from "@/lib/date-utils"
import { generateBookingId } from "@/lib/utils"

interface Movie {
  id: string
  title: string
  image: string
  rating: number
  genre: string
  duration: string
}

export default function ConfirmationPage() {
  const params = useParams()
  const movieId = params?.movieId as string
  const searchParams = useSearchParams()
  const router = useRouter()

  const [movie, setMovie] = React.useState<Movie | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [ticketGenerated, setTicketGenerated] = React.useState(false)
  const [bookingId] = React.useState(() => generateBookingId())

  React.useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/movies/${movieId}`)
      .then(res => {
        if (!res.ok) throw new Error("Movie not found")
        return res.json()
      })
      .then(data => {
        setMovie({
          id: data._id,
          title: data.title,
          image: data.image,
          rating: data.rating,
          genre: data.genre,
          duration: data.duration
        })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [movieId])

  const theaterId = searchParams.get("theater") || "1"
  const showtimeId = searchParams.get("showtime") || "1"
  const seatsParam = searchParams.get("seats") || ""
  const selectedSeats = seatsParam.split(",")
  const showDate = searchParams.get("date") || new Date().toISOString().split('T')[0]
  const showTime = searchParams.get("showtime") || "19:30"

  // Use these as placeholders until we implement dynamic data
  const theater = {
    id: theaterId,
    name: "CineTix IMAX - Downtown",
    address: "123 Main St, Downtown"
  }

  const ticketPrice = 129.99
  const convenienceFee = 1.5
  const totalPrice = selectedSeats.length * ticketPrice + (selectedSeats.length > 0 ? convenienceFee : 0)

  const handleDownloadTicket = () => {
    setTicketGenerated(true)
    // In a real app, this would generate a PDF ticket
    // For now, we'll just show a success message
  }

  if (loading) return <div className="p-8 text-center">Loading booking details...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!movie) return <div className="p-8 text-center text-red-500">Movie not found</div>

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon-green/20">
            <CheckCircle2 className="h-6 w-6 text-neon-green" />
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your booking has been confirmed. You can find your ticket details below.
          </p>
          <p className="text-sm text-muted-foreground">
            Booking ID: <span className="font-mono">{bookingId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ticket Details */}
          <div className="md:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Poster */}
                  <div className="relative w-full md:w-48 h-72 rounded-lg overflow-hidden">
                    <Image
                      src={movie.image}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {movie.genre} • {movie.duration} min
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-muted-foreground">{formatShowDate(showDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p className="text-muted-foreground">{formatShowTime(showTime)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Theater</p>
                          <p className="text-muted-foreground">{theater.name}</p>
                          <p className="text-muted-foreground">{theater.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Seats</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedSeats.map((seat) => (
                              <span
                                key={seat}
                                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
                              >
                                {seat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                className="flex-1 button-neon-green"
                onClick={handleDownloadTicket}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Ticket
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 hover:text-neon-blue hover:border-neon-blue"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Booking
              </Button>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tickets</span>
                    <span>₹{ticketPrice.toFixed(2)} x {selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Convenience Fee</span>
                    <span>₹{convenienceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Paid</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/" className="w-full">
                    <Button className="w-full button-neon-blue">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Message */}
        {ticketGenerated && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon-green/20 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ticket Generated!</h3>
                <p className="text-muted-foreground mb-4">
                  Your ticket has been generated successfully. You can download it from your email or the booking history.
                </p>
                <Button
                  className="button-neon-green"
                  onClick={() => setTicketGenerated(false)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
