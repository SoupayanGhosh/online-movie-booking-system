import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900/30 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 neon-green-glow">CineTix</h3>
            <p className="text-muted-foreground mb-4">
              Your ultimate destination for booking movie tickets online. Experience the best movies in theaters near
              you.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-blue">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-blue">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 neon-blue-glow">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/cinemas" className="text-muted-foreground hover:text-primary">
                  Cinemas
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-muted-foreground hover:text-primary">
                  Offers & Promotions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 neon-blue-glow">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 neon-blue-glow">Download Our App</h3>
            <p className="text-muted-foreground mb-4">
              Get the best movie ticket booking experience on your mobile device.
            </p>
            <div className="space-y-2">
              <Link href="#">
                <div className="border border-gray-700 rounded-md px-4 py-2 hover:border-neon-blue hover:text-neon-blue transition-colors">
                  App Store
                </div>
              </Link>
              <Link href="#">
                <div className="border border-gray-700 rounded-md px-4 py-2 hover:border-neon-green hover:text-neon-green transition-colors">
                  Google Play
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CineTix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

