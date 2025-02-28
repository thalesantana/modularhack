"use client";

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${language === 'en' ? 'bg-gray-100' : ''}`}
          onClick={() => setLanguage('en')}
        >
          <Image 
            src="/flags/us.svg" 
            alt="English" 
            width={20} 
            height={15} 
            className="rounded-sm"
          />
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center gap-2 ${language === 'pt-BR' ? 'bg-gray-100' : ''}`}
          onClick={() => setLanguage('pt-BR')}
        >
          <Image 
            src="/flags/br.svg" 
            alt="Português (Brasil)" 
            width={20} 
            height={15} 
            className="rounded-sm"
          />
          <span>Português (Brasil)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;