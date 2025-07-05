import Image from "next/image"
import Link from "next/link"
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

interface FeaturedMovieProps {
  movie: Movie | null
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  const [imageError, setImageError] = useState(false)

  if (!movie) {
    return (
      <div className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-10" />
        <div className="relative z-20 container mx-auto h-full flex flex-col justify-end pb-16 px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-green-glow">No Featured Movie</h1>
            <p className="text-lg mb-6">Check back soon for our next featured movie!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-10" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={imageError || !movie.image ? "/placeholder.jpg" : movie.image}
          alt={`${movie.title} featured movie background`}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          quality={90}
          onError={() => setImageError(true)}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-end pb-16 px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 neon-green-glow">{movie.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-sm">{movie.rating} ★</span>
            <span className="text-muted-foreground">{movie.genre}</span>
            <span className="text-muted-foreground">{movie.duration}</span>
          </div>
          <p className="text-lg mb-6">
            Experience the epic continuation of the acclaimed sci-fi adventure. Now showing in theaters nationwide.
          </p>
          <div className="flex gap-4">
            <Link href={`/booking/${movie.id}`}>
              <Button size="lg" className="button-neon-green">
                Book Tickets
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="hover:text-neon-blue hover:border-neon-blue">
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

