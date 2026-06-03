import { Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-950 text-white mt-20">
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <span>WZH</span>
          </div>
          <p className="text-gray-400 text-sm">Luxury streetwear for the fearless.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/category/Men" className="hover:text-white transition">Men</Link></li>
            <li><Link href="/category/Women" className="hover:text-white transition">Women</Link></li>
            <li><Link href="/category/Accessories" className="hover:text-white transition">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Contact</li>
            <li>FAQs</li>
            <li>Shipping</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <div className="flex">
            <input type="email" placeholder="Your email" className="bg-white/10 rounded-l-md px-4 py-2 text-sm w-full focus:outline-none" />
            <button className="bg-amber-500 px-4 rounded-r-md text-sm font-medium hover:bg-amber-600 transition">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-6 text-xs text-gray-500">
        © {new Date().getFullYear()} WZH. All rights reserved.
      </div>
    </footer>
  );
}