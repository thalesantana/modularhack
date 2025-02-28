# HoofLedger

![HoofLedger Logo](https://img.shields.io/badge/HoofLedger-Blockchain%20Cattle%20Marketplace-green)
![Scroll Network](https://img.shields.io/badge/Network-Scroll%20Sepolia-6A51FF)
![Status](https://img.shields.io/badge/Status-Demo-orange)

🌐 **Site**: [https://hoofledger.vercel.app/](https://hoofledger.vercel.app/)

## 🐄 Visão Geral

HoofLedger é uma plataforma descentralizada para a tokenização e comercialização de gado no Brasil através de NFTs. O sistema permite que produtores rurais transformem seus animais em ativos digitais (NFTs) e os comercializem em um marketplace baseado em leilões, trazendo transparência, rastreabilidade e novas oportunidades de mercado para o agronegócio.

## 🚀 Principais Funcionalidades

- **Tokenização de Gado**: Transforme gado real em NFTs com características detalhadas
- **Marketplace de Leilões**: Sistema completo para criar e participar de leilões de gado tokenizado
- **Integração Blockchain**: Contratos inteligentes rodando na rede Scroll Sepolia
- **UI/UX Intuitiva**: Interface acessível para produtores rurais e investidores
- **Sistema de Mocks**: Demonstração completa do sistema sem necessidade de conexão real

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: Solidity, Ethers.js, Hardhat
- **Rede**: Scroll Sepolia (L2 para Ethereum)
- **Contratos Verificados**: ScrollScan

## 🔄 Arquitetura do Projeto

```
HoofLedger/
├── frontend/               # Aplicação Next.js com interface do usuário
│   ├── app/                # Rotas e páginas
│   ├── components/         # Componentes React reutilizáveis
│   ├── context/            # Contextos React (WalletContext, etc)
│   ├── lib/                # Biblioteca e serviços (blockchain-service, etc)
│   └── public/             # Arquivos estáticos
├── backend/                # Serviços de backend
│   └── hoof-ledger/        # Aplicação NestJS (implementação parcial/mock)
│       ├── contracts/      # Smart contracts em Solidity
│       ├── scripts/        # Scripts de deploy e interação
│       └── hardhat.config.ts  # Configuração do Hardhat
```

## 📋 Status do Projeto

**Demonstração Funcional**: O projeto está em fase de demonstração, com contratos inteligentes implantados na rede Scroll Sepolia e frontend funcional.

**Backend**: Por questões de prazo, o backend foi implementado como um sistema de mocks no frontend, permitindo demonstrar todas as funcionalidades sem dependência de serviços externos.

## ⚙️ Configuração e Execução

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Contratos (opcional para testes)

```bash
cd backend/hoof-ledger
npm install
npx hardhat run scripts/deploy-scroll.ts --network scrollSepolia
```

## 🌐 Contratos Implantados (Scroll Sepolia)

- **CattleNFT**: `0xcf8Bf47C05FeE846a0361610e85858Ad281d47a4`
  - [Ver no ScrollScan](https://sepolia.scrollscan.com/address/0xcf8Bf47C05FeE846a0361610e85858Ad281d47a4#code)

- **CattleAuction**: `0x1f54a47DEC6301F2dD02Ba53594e5d038dE4b229`
  - [Ver no ScrollScan](https://sepolia.scrollscan.com/address/0x1f54a47DEC6301F2dD02Ba53594e5d038dE4b229#code)

## 🙌 Contribuidores

- **Bianca Gadelha**
  - Email: biancagadelha97@gmail.com
  - GitHub: [BiancaGadelha](https://github.com/BiancaGadelha)

- **Christian Gadelha**
  - Email: cpradogadelha@gmail.com
  - GitHub: [chrisgadelha](https://github.com/chrisgadelha)

- **Renato Gravino**
  - Email: renato.gravino.neto@gmail.com
  - GitHub: [renatogravino](https://github.com/renatogravino)

- **Thales Santana**
  - Email: thales.santana.eng@gmail.com
  - GitHub: [thalesantana](https://github.com/thalesantana)

## 📜 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).


