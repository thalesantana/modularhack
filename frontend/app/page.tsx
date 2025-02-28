"use client";

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Beef, ShieldCheck, TrendingUp, Gavel } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center py-32"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516367069252-28c0dda48b08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auctions">
              <Button className="bg-[#277928] hover:bg-[#1d5b1e] text-white px-8 py-6 text-lg">
                {t('home.hero.browseAuctions')}
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#277928] px-8 py-6 text-lg">
                {t('home.hero.register')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('home.features.title')} <span className="text-[#277928]">HoofLedger</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-[#6daf6f] p-3 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.features.blockchain.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.blockchain.desc')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-[#6daf6f] p-3 rounded-full mb-4">
                <Beef className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.features.nft.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.nft.desc')}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-[#6daf6f] p-3 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.features.global.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.global.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('home.howItWorks.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#277928] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.howItWorks.step1.title')}</h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step1.desc')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#277928] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.howItWorks.step2.title')}</h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step2.desc')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#277928] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.howItWorks.step3.title')}</h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step3.desc')}
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#277928] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#277928]">{t('home.howItWorks.step4.title')}</h3>
              <p className="text-gray-600">
                {t('home.howItWorks.step4.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('home.featured.title')}
            </h2>
            <Link href="/auctions">
              <Button variant="outline" className="border-[#277928] text-[#277928] hover:bg-[#277928] hover:text-white">
                {t('home.featured.viewAll')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sample Auction Items */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="w-full h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Angus Bull" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#277928]">Premium Angus Bull</h3>
                  <span className="bg-[#6daf6f] text-white px-2 py-1 rounded-full text-xs">{t('common.active')}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  3 years old, 1200 lbs, excellent genetics
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{t('home.featured.currentBid')}</p>
                    <p className="font-bold">2.5 ETH</p>
                  </div>
                  <Link href="/auctions/1">
                    <Button size="sm" className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                      {t('home.featured.bidNow')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="w-full h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1545468259-3377ebe47caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Hereford Heifer" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#277928]">Hereford Heifer</h3>
                  <span className="bg-[#6daf6f] text-white px-2 py-1 rounded-full text-xs">{t('common.active')}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  2 years old, 900 lbs, breeding quality
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{t('home.featured.currentBid')}</p>
                    <p className="font-bold">1.8 ETH</p>
                  </div>
                  <Link href="/auctions/2">
                    <Button size="sm" className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                      {t('home.featured.bidNow')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="w-full h-48 relative">
                <Image 
                  src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Brahman Bull" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-[#277928]">Brahman Bull</h3>
                  <span className="bg-[#6daf6f] text-white px-2 py-1 rounded-full text-xs">{t('common.active')}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  4 years old, 1400 lbs, heat resistant
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{t('home.featured.currentBid')}</p>
                    <p className="font-bold">3.2 ETH</p>
                  </div>
                  <Link href="/auctions/3">
                    <Button size="sm" className="bg-[#277928] hover:bg-[#1d5b1e] text-white">
                      {t('home.featured.bidNow')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#277928]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="bg-white text-[#277928] hover:bg-gray-100 px-8 py-6 text-lg">
                {t('home.cta.getStarted')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#277928] px-8 py-6 text-lg">
                {t('home.cta.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}