"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'pt-BR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'en': {
    // Navbar
    'nav.home': 'Home',
    'nav.auctions': 'Auctions',
    'nav.profile': 'Profile',
    'nav.createListing': 'Create Listing',
    'nav.connect': 'Connect Wallet',
    'nav.disconnect': 'Disconnect',
    
    // Home page
    'home.hero.title': 'Welcome to HoofLedger',
    'home.hero.subtitle': 'The future of cattle auctions on the blockchain. Secure, transparent, and efficient.',
    'home.hero.browseAuctions': 'Browse Auctions',
    'home.hero.register': 'Register Now',
    'home.features.title': 'Why Choose HoofLedger',
    'home.features.blockchain.title': 'Secure Blockchain Technology',
    'home.features.blockchain.desc': 'Every transaction is recorded on the blockchain, ensuring complete transparency and security for both buyers and sellers.',
    'home.features.nft.title': 'NFT Cattle Certification',
    'home.features.nft.desc': 'Each animal is represented as a unique NFT with verifiable history, health records, and ownership information.',
    'home.features.global.title': 'Global Market Access',
    'home.features.global.desc': 'Connect with buyers and sellers worldwide, expanding your market reach beyond traditional boundaries.',
    'home.howItWorks.title': 'How It Works',
    'home.howItWorks.step1.title': 'Connect Wallet',
    'home.howItWorks.step1.desc': 'Connect your cryptocurrency wallet to authenticate and enable secure transactions.',
    'home.howItWorks.step2.title': 'Register Profile',
    'home.howItWorks.step2.desc': 'Create your profile as a buyer or auctioneer with basic information linked to your wallet.',
    'home.howItWorks.step3.title': 'List or Bid',
    'home.howItWorks.step3.desc': 'List your cattle as NFTs with detailed information or place bids on available auctions.',
    'home.howItWorks.step4.title': 'Secure Transfer',
    'home.howItWorks.step4.desc': 'When a sale is complete, ownership transfers automatically through smart contracts.',
    'home.featured.title': 'Featured Auctions',
    'home.featured.viewAll': 'View All',
    'home.featured.currentBid': 'Current Bid',
    'home.featured.bidNow': 'Bid Now',
    'home.cta.title': 'Ready to Transform Your Cattle Business?',
    'home.cta.subtitle': 'Join HoofLedger today and experience the future of livestock trading with blockchain technology.',
    'home.cta.getStarted': 'Get Started',
    'home.cta.contactUs': 'Contact Us',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.resources': 'Resources',
    'footer.contactUs': 'Contact Us',
    'footer.rights': 'All rights reserved.',
    'footer.description': 'The premier blockchain-based cattle auction platform, transforming livestock trading with transparency and security.',
    
    // Profile
    'profile.editProfile': 'Edit Profile',
    'profile.logout': 'Logout',
    'profile.tabs.overview': 'Overview',
    'profile.tabs.myAuctions': 'My Auctions',
    'profile.tabs.bidHistory': 'Bid History',
    'profile.tabs.nftCollection': 'NFT Collection',
    'profile.tabs.settings': 'Settings',
    'profile.wallet.title': 'Wallet Information',
    'profile.wallet.details': 'Wallet Details',
    'profile.wallet.detailsDesc': 'Your blockchain wallet information',
    'profile.wallet.address': 'Wallet Address',
    'profile.wallet.network': 'Network',
    'profile.wallet.accountType': 'Account Type',
    'profile.wallet.viewEtherscan': 'View on Etherscan',
    'profile.wallet.change': 'Change Linked Wallet',
    'profile.wallet.changeTitle': 'Change Wallet',
    'profile.wallet.changeDesc': 'Link a new wallet to your HoofLedger profile',
    'profile.wallet.changeDialogDesc': 'Link a new wallet to your HoofLedger profile. This will transfer your profile data to the new wallet.',
    'profile.wallet.important': 'Important',
    'profile.wallet.warningMessage': 'You must have access to both wallets to complete this process. All your NFTs and assets will need to be transferred separately.',
    'profile.wallet.current': 'Current Wallet',
    'profile.wallet.new': 'New Wallet Address',
    'profile.wallet.newWalletDesc': 'Enter the Ethereum address of your new wallet',
    'profile.wallet.confirm': 'Change Wallet',
    'profile.wallet.connect': 'Connect Your Wallet',
    'profile.wallet.connectMessage': 'Please connect your wallet or register to view your wallet information.',
    'profile.wallet.connected': 'Connected Since',
    'profile.backToProfile': 'Back to Profile',
    
    // Common
    'common.active': 'Active',
    'common.ended': 'Ended',
    'common.view': 'View',
    'common.cancel': 'Cancel',
    'common.save': 'Save Changes',
    'common.processing': 'Processing...',
  },
  'pt-BR': {
    // Navbar
    'nav.home': 'Início',
    'nav.auctions': 'Leilões',
    'nav.profile': 'Perfil',
    'nav.createListing': 'Criar Anúncio',
    'nav.connect': 'Conectar Carteira',
    'nav.disconnect': 'Desconectar',
    
    // Home page
    'home.hero.title': 'Bem-vindo ao HoofLedger',
    'home.hero.subtitle': 'O futuro dos leilões de gado na blockchain. Seguro, transparente e eficiente.',
    'home.hero.browseAuctions': 'Explorar Leilões',
    'home.hero.register': 'Registre-se Agora',
    'home.features.title': 'Por que Escolher HoofLedger',
    'home.features.blockchain.title': 'Tecnologia Blockchain Segura',
    'home.features.blockchain.desc': 'Cada transação é registrada na blockchain, garantindo total transparência e segurança para compradores e vendedores.',
    'home.features.nft.title': 'Certificação de Gado em NFT',
    'home.features.nft.desc': 'Cada animal é representado como um NFT único com histórico verificável, registros de saúde e informações de propriedade.',
    'home.features.global.title': 'Acesso ao Mercado Global',
    'home.features.global.desc': 'Conecte-se com compradores e vendedores em todo o mundo, expandindo seu alcance de mercado além das fronteiras tradicionais.',
    'home.howItWorks.title': 'Como Funciona',
    'home.howItWorks.step1.title': 'Conecte sua Carteira',
    'home.howItWorks.step1.desc': 'Conecte sua carteira de criptomoedas para autenticar e permitir transações seguras.',
    'home.howItWorks.step2.title': 'Registre seu Perfil',
    'home.howItWorks.step2.desc': 'Crie seu perfil como comprador ou leiloeiro com informações básicas vinculadas à sua carteira.',
    'home.howItWorks.step3.title': 'Liste ou Oferte',
    'home.howItWorks.step3.desc': 'Liste seu gado como NFTs com informações detalhadas ou faça ofertas em leilões disponíveis.',
    'home.howItWorks.step4.title': 'Transferência Segura',
    'home.howItWorks.step4.desc': 'Quando uma venda é concluída, a propriedade é transferida automaticamente através de contratos inteligentes.',
    'home.featured.title': 'Leilões em Destaque',
    'home.featured.viewAll': 'Ver Todos',
    'home.featured.currentBid': 'Lance Atual',
    'home.featured.bidNow': 'Ofertar Agora',
    'home.cta.title': 'Pronto para Transformar seu Negócio de Gado?',
    'home.cta.subtitle': 'Junte-se ao HoofLedger hoje e experimente o futuro do comércio de gado com tecnologia blockchain.',
    'home.cta.getStarted': 'Começar',
    'home.cta.contactUs': 'Fale Conosco',
    
    // Footer
    'footer.quickLinks': 'Links Rápidos',
    'footer.resources': 'Recursos',
    'footer.contactUs': 'Fale Conosco',
    'footer.terms': 'Termos de Uso',
    'footer.police': 'Política de Privacidade',
    'footer.howItWorks': 'Como Funciona',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.description': 'A principal plataforma de leilão de gado baseada em blockchain, transformando o comércio de gado com transparência e segurança.',
    
    // Profile
    'profile.editProfile': 'Editar Perfil',
    'profile.logout': 'Sair',
    'profile.tabs.overview': 'Visão Geral',
    'profile.tabs.myAuctions': 'Meus Leilões',
    'profile.tabs.bidHistory': 'Histórico de Lances',
    'profile.tabs.nftCollection': 'Coleção NFT',
    'profile.tabs.settings': 'Configurações',
    'profile.wallet.title': 'Informações da Carteira',
    'profile.wallet.details': 'Detalhes da Carteira',
    'profile.wallet.detailsDesc': 'Suas informações de carteira blockchain',
    'profile.wallet.address': 'Endereço da Carteira',
    'profile.wallet.network': 'Rede',
    'profile.wallet.accountType': 'Tipo de Conta',
    'profile.wallet.viewEtherscan': 'Ver no Etherscan',
    'profile.wallet.change': 'Alterar Carteira Vinculada',
    'profile.wallet.changeTitle': 'Alterar Carteira',
    'profile.wallet.changeDesc': 'Vincule uma nova carteira ao seu perfil HoofLedger',
    'profile.wallet.changeDialogDesc': 'Vincule uma nova carteira ao seu perfil HoofLedger. Isso transferirá seus dados de perfil para a nova carteira.',
    'profile.wallet.important': 'Importante',
    'profile.wallet.warningMessage': 'Você deve ter acesso a ambas as carteiras para completar este processo. Todos os seus NFTs e ativos precisarão ser transferidos separadamente.',
    'profile.wallet.current': 'Carteira Atual',
    'profile.wallet.new': 'Novo Endereço de Carteira',
    'profile.wallet.newWalletDesc': 'Digite o endereço Ethereum da sua nova carteira',
    'profile.wallet.confirm': 'Alterar Carteira',
    'profile.wallet.connect': 'Conecte Sua Carteira',
    'profile.wallet.connectMessage': 'Por favor, conecte sua carteira ou registre-se para ver suas informações de carteira.',
    'profile.wallet.connected': 'Conectado Desde',
    'profile.backToProfile': 'Voltar ao Perfil',
    
    // Common
    'common.active': 'Ativo',
    'common.ended': 'Encerrado',
    'common.view': 'Visualizar',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar Alterações',
    'common.processing': 'Processando...',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Check if language preference is stored in localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'pt-BR')) {
      setLanguageState(storedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt')) {
        setLanguageState('pt-BR');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};