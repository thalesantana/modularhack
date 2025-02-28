"use client";

import { useLanguage } from '@/context/LanguageContext';
import { Beef, Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#277928] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Beef className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">HoofLedger</span>
            </div>
            <p className="text-sm">
              {t('footer.description')}
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
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#6daf6f] transition-colors">{t('nav.home')}</Link>
              </li>
              <li>
                <Link href="/auctions" className="hover:text-[#6daf6f] transition-colors">{t('nav.auctions')}</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#6daf6f] transition-colors">{t('nav.profile')}</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-[#6daf6f] transition-colors">{t('footer.howItWorks')}</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#6daf6f] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#6daf6f] transition-colors">{t('footer.terms')}</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#6daf6f] transition-colors">{t('footer.police')}</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
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
          <p>&copy; {currentYear} HoofLedger. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;