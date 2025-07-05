"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Wallet, Smartphone, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatShowDate, formatShowTime } from "@/lib/date-utils"

interface Movie {
  _id?: string
  id: string
  title: string
  image: string
  rating: number
  genre: string
  duration: string
  description: string
}

type MovieParams = {
  movieId: string
}

type PaymentPageProps = {
  params: Promise<MovieParams>
}

const PaymentPage: React.FC<PaymentPageProps> = ({ params }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { movieId } = React.use(params)

  const [movie, setMovie] = React.useState<Movie | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const theaterId = searchParams.get("theater") || ""
  const showtime = searchParams.get("showtime") || ""
  const showDate = searchParams.get("date") || ""
  const seatsParam = searchParams.get("seats") || ""
  const selectedSeats = seatsParam ? seatsParam.split(",") : []

  // Fetch movie details
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/movies/${movieId}`)
      .then(res => {
        if (!res.ok) throw new Error("Movie not found")
        return res.json()
      })
      .then(data => setMovie({
        id: data._id || data.id,
        _id: data._id,
        title: data.title,
        image: data.image || "/placeholder.svg",
        rating: data.rating,
        genre: data.genre,
        duration: data.duration,
        description: data.description || ""
      }))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [movieId])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const params = new URLSearchParams({
        theater: theaterId,
        showtime: showtime,
        date: showDate,
        seats: selectedSeats.join(",")
      })
      router.push(`/booking/${movieId}/confirmation?${params.toString()}`)
    }, 2000)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!movie) return <div className="p-8 text-center text-red-500">Movie not found</div>

  const formattedDate = formatShowDate(showDate)
  const formattedTime = formatShowTime(showtime)
  const ticketPrice = 129.99
  const totalAmount = selectedSeats.length * ticketPrice

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-gray-400">
          {movie.title} • {theaterId} • {formattedDate} • {formattedTime} • Seats: {selectedSeats.join(", ")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card"><CreditCard className="h-4 w-4 mr-1" />Card</TabsTrigger>
                  <TabsTrigger value="wallet"><Wallet className="h-4 w-4 mr-1" />Wallet</TabsTrigger>
                  <TabsTrigger value="mobile"><Smartphone className="h-4 w-4 mr-1" />Mobile Pay</TabsTrigger>
                </TabsList>

                {/* Card Payment */}
                <TabsContent value="card">
                  <form onSubmit={handlePayment} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required maxLength={4} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
                    </Button>
                  </form>
                </TabsContent>

                {/* Wallet Payment */}
                <TabsContent value="wallet">
                  <div className="py-6">
                    <RadioGroup defaultValue="paypal">
                      {["PayPal", "Google Pay", "Apple Pay"].map((option) => (
                        <div key={option} className="flex items-center space-x-2 mb-4">
                          <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase()} />
                          <Label htmlFor={option.toLowerCase()}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button className="w-full mt-6" size="lg" onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
                    </Button>
                  </div>
                </TabsContent>

                {/* Mobile Payment */}
                <TabsContent value="mobile">
                  <div className="py-6 text-center">
                    <div className="bg-gray-100 p-8 rounded-lg mb-6">
                      <p className="text-gray-500">Scan QR Code to Pay</p>
                      <div className="w-48 h-48 mx-auto bg-gray-300 mt-4" />
                    </div>
                    <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "I've Completed the Payment"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between"><span>Movie</span><span>{movie.title}</span></div>
              <div className="flex justify-between"><span>Theater</span><span>{theaterId}</span></div>
              <div className="flex justify-between"><span>Date & Time</span><span>{formattedDate}, {formattedTime}</span></div>
              <div className="flex justify-between"><span>Seats</span><span>{selectedSeats.join(", ")}</span></div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2"><span>Tickets</span><span>₹{(selectedSeats.length * ticketPrice).toFixed(2)}</span></div>
                <div className="flex justify-between mb-2"><span>Convenience Fee</span><span>₹{(selectedSeats.length > 0 ? 1.5 : 0).toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{totalAmount.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
