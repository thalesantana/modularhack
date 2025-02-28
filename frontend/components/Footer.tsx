import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#277928] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="HoofLedger Logo" width={58} height={78}  />
              <span className="text-xl font-bold">HoofLedger</span>
            </div>
            <p className="text-sm">
              The premier blockchain-based cattle auction platform, transforming livestock trading with transparency and security.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#6daf6f] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-[#6daf6f] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-[#6daf6f] transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#6daf6f] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/auctions" className="hover:text-[#6daf6f] transition-colors">Auctions</Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-[#6daf6f] transition-colors">Marketplace</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#6daf6f] transition-colors">My Profile</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-[#6daf6f] transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#6daf6f] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#6daf6f] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#6daf6f] transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a href="mailto:info@hoofledger.com" className="hover:text-[#6daf6f] transition-colors">
                  info@hoofledger.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <a href="tel:+1234567890" className="hover:text-[#6daf6f] transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#6daf6f] mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} HoofLedger. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;