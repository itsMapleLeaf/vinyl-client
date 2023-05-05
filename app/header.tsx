import { Disc } from "lucide-react"
import Link from "next/link"
import { HeaderMenu } from "./header-menu"

export function Header() {
  return (
    <header className="h-16 flex flex-row items-center panel border-b sticky top-0 z-10">
      <nav className="container flex flex-row items-center">
        <div className="flex-1 flex flex-row">
          <HeaderMenu />
        </div>

        <Link href="/" className="link">
          <Disc aria-hidden size={32} />
          <span className="sr-only">Home</span>
        </Link>

        <div className="flex-1 flex flex-row justify-end">
          <button className="rounded-full border-2 border-transparent hover:border-accent-700 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.discordapp.com/avatars/91634403746275328/8f99339380cdefe185e99f7756d1b6c6.webp"
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <span className="sr-only">Account</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
