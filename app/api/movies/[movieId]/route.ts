import { NextResponse } from "next/server";

function generateShowtimes() {
  const today = new Date();
  const showtimes = [];

  // Generate showtimes for next 5 days
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Standard showtimes for each day
    const times = ["10:30", "13:15", "16:00", "19:30", "22:15"];
    const theatersPerTime = [
      { id: "1", name: "CineTix IMAX - Downtown" },
      { id: "2", name: "CineTix Multiplex - Westside" },
      { id: "3", name: "CineTix Premiere - Eastgate" }
    ];
    
    const dayShowtimes = times.flatMap(time => 
      theatersPerTime.map(theater => ({
        time,
        theaterId: theater.id
      }))
    );

    showtimes.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      showtimes: dayShowtimes
    });
  }

  return showtimes;
}

// Sample movie data with dynamic showtimes
const sampleMovies = [
  {
    _id: "1",
    title: "Dune: Part Two",
    image: "/dune 2.jpg",
    rating: 4.8,
    genre: "Sci-Fi",
    duration: "2h 46m",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    showtimes: generateShowtimes()
  },
  {
    _id: "2",
    title: "Oppenheimer",
    image: "/opp.jpg",
    rating: 4.7,
    genre: "Drama",
    duration: "3h 0m",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    showtimes: generateShowtimes()
  },
  {
    _id: "3",
    title: "The Batman",
    image: "/batman.jpg",
    rating: 4.5,
    genre: "Action",
    duration: "2h 56m",
    description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    showtimes: generateShowtimes()
  },
  {
    _id: "4",
    title: "Deadpool",
    image: "/dp.jpg",
    rating: 4.6,
    genre: "Action",
    duration: "2h 7m",
    description: "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
    showtimes: generateShowtimes()
  },
  {
    _id: "5",
    title: "Kong: Skull Island",
    image: "/kong.jpg",
    rating: 4.3,
    genre: "Adventure",
    duration: "1h 58m",
    description: "A team of scientists explore an uncharted island in the Pacific, venturing into the domain of the mighty Kong.",
    showtimes: generateShowtimes()
  },
  {
    _id: "6",
    title: "Inside Out",
    image: "/inside.jpg",
    rating: 4.4,
    genre: "Animation",
    duration: "1h 42m",
    description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.",
    showtimes: generateShowtimes()
  },
  {
    _id: "7",
    title: "A Quiet Place",
    image: "/quiet.jpg",
    rating: 4.5,
    genre: "Horror",
    duration: "1h 30m",
    description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
    showtimes: generateShowtimes()
  }
];

export async function GET(
  request: Request,
  context: { params: { movieId: string } }
) {
  try {    const { params } = context;
    const { movieId } = params;

    const movie = sampleMovies.find(m => m._id === movieId);
    if (!movie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ message: "Error fetching movie" }, { status: 500 });
  }
}
