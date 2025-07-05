import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique ticket code
export function generateTicketCode(movieId: string, showTimeId: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 5)
  return `TIX-${movieId.slice(-4)}-${showTimeId.slice(-4)}-${timestamp}-${random}`.toUpperCase()
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Format time to HH:MM
export function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5)
}

// Get available dates for the next 7 days
export function getAvailableDates(): Date[] {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  return dates
}

// Get available show times (e.g., 10:00, 13:00, 16:00, 19:00, 22:00)
export function getAvailableShowTimes(): string[] {
  return ['10:00', '13:00', '16:00', '19:00', '22:00']
}

// Check if a show time is in the past
export function isShowTimeInPast(date: Date, time: string): boolean {
  const [hours, minutes] = time.split(':').map(Number)
  const showDateTime = new Date(date)
  showDateTime.setHours(hours, minutes, 0, 0)
  return showDateTime < new Date()
}

// Format date and time for display
export function formatDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':')
  const showDateTime = new Date(date)
  showDateTime.setHours(parseInt(hours), parseInt(minutes))
  return showDateTime.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Calculate end time based on movie duration
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, 0, 0)
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
  return endDate.toTimeString().slice(0, 5)
}

// Validate seat availability
export function validateSeatAvailability(
  availableSeats: number,
  requestedSeats: number,
  maxSeatsPerBooking: number = 6
): { isValid: boolean; message?: string } {
  if (requestedSeats <= 0) {
    return { isValid: false, message: 'Number of seats must be greater than 0' };
  }

  if (requestedSeats > maxSeatsPerBooking) {
    return { 
      isValid: false, 
      message: `Cannot book more than ${maxSeatsPerBooking} seats at once` 
    };
  }

  if (requestedSeats > availableSeats) {
    return { 
      isValid: false, 
      message: `Only ${availableSeats} seats available` 
    };
  }

  return { isValid: true };
}

// Calculate total price
export function calculateTotalPrice(pricePerSeat: number, numberOfSeats: number): number {
  return Number((pricePerSeat * numberOfSeats).toFixed(2));
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Generate a unique booking ID
export function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const prefix = 'BK';
  return `${prefix}-${timestamp}-${random}`;
}
