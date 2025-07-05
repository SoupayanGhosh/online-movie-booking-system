"use client"

import React, { use, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SeatSelector } from "@/components/seat-selector"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatShowDate, formatShowTime } from "@/lib/date-utils"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

type SeatsPageProps = {
  params: Promise<MovieParams>
}

// Sample seat data - in a real app, this would come from an API
const generateSeatData = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
  const seatsPerRow = 8
  const takenSeats = new Set<string>()
  
  // Randomly mark some seats as taken
  rows.forEach(row => {
    const numTaken = Math.floor(Math.random() * 3) // 0-2 seats per row
    for (let i = 0; i < numTaken; i++) {
      const seatNum = Math.floor(Math.random() * seatsPerRow) + 1
      takenSeats.add(`${row}${seatNum}`)
    }
  })
  
  return {
    rows,
    seatsPerRow,
    takenSeats: Array.from(takenSeats)
  }
}

export default function SeatsPage({ params }: SeatsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { movieId } = use(params)

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [couponCode, setCouponCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null)
  const [couponError, setCouponError] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const theaterId = searchParams.get("theater") || ""
  const showtime = searchParams.get("showtime") || ""
  const showDate = searchParams.get("date") || ""
  const [seatData] = useState(generateSeatData())

  // Base price per seat
  const basePrice = 129.99
  const totalAmount = selectedSeats.length * basePrice
  const finalAmount = appliedDiscount ? totalAmount - appliedDiscount : totalAmount

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

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId)
      }
      return [...prev, seatId]
    })
    // Reset coupon when seats change
    setAppliedDiscount(null)
    setCouponCode("")
    setCouponError("")
  }

  const applyCoupon = async () => {
    if (!couponCode || selectedSeats.length === 0) return

    setIsApplyingCoupon(true)
    setCouponError("")
    
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          amount: totalAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.message)
        setAppliedDiscount(null)
        return
      }

      setAppliedDiscount(data.discount)
    } catch (err) {
      setCouponError('Failed to apply coupon. Please try again.')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) return
    
    const params = new URLSearchParams({
      theater: theaterId,
      showtime: showtime,
      date: showDate,
      seats: selectedSeats.join(','),
      discount: String(appliedDiscount || 0)
    })
    
    router.push(`/booking/${movieId}/payment?${params.toString()}`)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!movie) return <div className="p-8 text-center text-red-500">Movie not found</div>

  const formattedDate = formatShowDate(showDate)
  const formattedTime = formatShowTime(showtime)

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your Seats</CardTitle>
          <p className="text-muted-foreground">
            {movie.title} - {formattedDate} at {formattedTime}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-2xl">
              <SeatSelector
                rows={seatData.rows}
                seatsPerRow={seatData.seatsPerRow}
                takenSeats={Array.from(seatData.takenSeats)}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-neon-green" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500" />
                <span>Taken</span>
              </div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Have a Coupon Code?</h3>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1"
                />
                <Button
                  onClick={applyCoupon}
                  disabled={isApplyingCoupon || !couponCode}
                  className="button-neon-green"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              </div>
              {couponError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{couponError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-lg font-semibold">
              Selected Seats: {selectedSeats.join(", ") || "None"}
            </p>
            <p className="text-muted-foreground">
              Price per seat: ₹{basePrice.toFixed(2)}
            </p>
            <p className="text-lg">
              Subtotal: ₹{totalAmount.toFixed(2)}
            </p>
            {appliedDiscount && (
              <p className="text-green-600">
                Discount: -₹{appliedDiscount.toFixed(2)}
              </p>
            )}
            <p className="text-xl font-bold text-neon-green mt-1">
              Total: ₹{finalAmount.toFixed(2)}
            </p>
          </div>
          <Button
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
            className="button-neon-green"
          >
            Continue to Payment
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
