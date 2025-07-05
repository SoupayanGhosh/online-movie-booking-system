"use client"
import { cn } from "@/lib/utils"

interface SeatSelectorProps {
  onSeatSelect: (seatId: string) => void
  selectedSeats: string[]
  takenSeats: string[]
  rows: string[]
  seatsPerRow: number
}

export function SeatSelector({ onSeatSelect, selectedSeats, takenSeats, rows, seatsPerRow }: SeatSelectorProps) {
  return (
    <div className="grid gap-y-2">
      {rows.map((row) => (
        <div key={row} className="flex items-center gap-2">
          <div className="w-6 text-center font-medium">{row}</div>
          <div className="flex gap-2 justify-center flex-1">
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seatNumber = i + 1
              const seatId = `${row}${seatNumber}`
              const isSelected = selectedSeats.includes(seatId)
              const isTaken = takenSeats.includes(seatId)

              return (
                <button
                  key={seatId}
                  className={cn(
                    "w-8 h-8 rounded-sm text-xs flex items-center justify-center transition-colors",
                    isSelected ? "seat-selected" : isTaken ? "seat-taken" : "seat-available",
                  )}
                  onClick={() => !isTaken && onSeatSelect(seatId)}
                  disabled={isTaken}
                  aria-label={`Seat ${seatId} ${isTaken ? "taken" : isSelected ? "selected" : "available"}`}
                >
                  {seatNumber}
                </button>
              )
            })}
          </div>
          <div className="w-6 text-center font-medium">{row}</div>
        </div>
      ))}
    </div>
  )
}

