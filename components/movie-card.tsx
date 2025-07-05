import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Movie {
  id: string
  title: string
  image: string
  rating: number
  genre: string
  duration: string
}

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-gray-900/50 border-gray-800 movie-card-hover">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={imageError ? "/placeholder.jpg" : movie.image}
          alt={`${movie.title} movie poster`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
          priority={false}
          quality={85}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{movie.title}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-neon-green text-neon-green mr-1" />
            <span className="text-sm font-medium">{movie.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{movie.genre}</p>
        <p className="text-sm text-muted-foreground">{movie.duration}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/booking/${movie.id}`} className="w-full">
          <Button className="w-full button-neon-blue">Book Tickets</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

