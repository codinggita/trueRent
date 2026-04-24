import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          TrueRent
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/fraud" className="hover:text-blue-600 transition-colors">
            Scan Listing
          </Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link
            href="/post"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Listing
          </Link>
        </div>
      </div>
    </nav>
  );
}
