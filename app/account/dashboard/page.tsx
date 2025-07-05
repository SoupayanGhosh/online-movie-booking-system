"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { DatabaseService } from '@/lib/db'
import { Booking } from '@/models/Booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Ticket, Download, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import LoadingSpinner from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'

export default function UserDashboard() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      const fetchBookings = async () => {
        try {
          const db = await DatabaseService.getInstance()
          const userBookings = await db.getBookingsByUser(session.user.id)
          setBookings(userBookings)
          logger.info('User logged in', { userId: session.user.id })
        } catch (error) {
          console.error('Error fetching bookings:', error)
          logger.error('Payment failed', { error: error })
        } finally {
          setLoading(false)
        }
      }
      fetchBookings()
    }
  }, [session])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" text="Loading your bookings..." />
      </div>
    )
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            My Bookings
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/">Browse Movies</a>
            </Button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 bg-muted/30 rounded-lg border border-dashed"
            >
              <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">You haven't made any bookings yet.</p>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <a href="/">Start Booking</a>
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id?.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="transform transition-all duration-200"
                >
                  <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
                      <CardTitle className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-mono">#{booking.ticketCode}</span>
                      </CardTitle>
                      <motion.span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'cancelled' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {booking.status}
                      </motion.span>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Show Date</p>
                            <p className="font-medium">{format(new Date(booking.showDate), 'PPP')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Show Time</p>
                            <p className="font-medium">{booking.showTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Seats</p>
                            <p className="font-medium">{booking.seats}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-primary/10"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Ticket
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="hover:bg-destructive/90"
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 