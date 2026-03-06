
import { Country } from './types';

export const TOTAL_CAPITAL = 100_000_000;
export const HORIZON = 5;
export const LOCKED_PERIOD = 2;
export const START_YEAR = 2026;

export const COUNTRIES: Country[] = [
  {
    id: 'india',
    name: 'India',
    projectName: 'Navi Mumbai Airport Logistics Hub',
    projectIcon: '🏗️',
    currency: 'INR',
    region: 'South Asia',
    classification: 'Emerging',
    businessType: 'Enterprise AI Services',
    growthProfile: 'High',
    fxStability: 'Medium',
    politicalRisk: 'Medium',
    repatriationFriction: 'High',
    localBorrowingRate: 0.085,
    ops: {
      baseYearRevenueLC: 8_000_000_000,
      annualGrowthRate: 0.18,
      variableCostRate: 0.45,
      variableCostGrowth: 0.01, // 1% increase in cost rate annually
      fixedCostsLC: 1_200_000_000,
      depreciationLC: 400_000_000,
      initialCapexUSD: 100_000_000,
      maintenanceCapexRate: 0.05,
      workingCapitalRate: 0.12,
      reinvestmentInterestRate: 0.06,
      reinvestmentRate: 0.20
    },
    policy: {
      localCorporateTax: 0.25,
      repatriationTax: 0.15,
      capitalControls: true,
      forcedReinvestment: false
    },
    macro: {
      spotFX: 83.0,
      expectedDrift: 0.03,
      volatility: 0.10,
      localInflation: 0.05
    }
  },
  {
    id: 'germany',
    name: 'Germany',
    projectName: 'Bavarian Precision Automation Center',
    projectIcon: '🤖',
    currency: 'EUR',
    region: 'Europe',
    classification: 'Developed',
    businessType: 'Precision Robotics',
    growthProfile: 'Low',
    fxStability: 'High',
    politicalRisk: 'Low',
    repatriationFriction: 'Low',
    localBorrowingRate: 0.035,
    ops: {
      baseYearRevenueLC: 85_000_000,
      annualGrowthRate: 0.04,
      variableCostRate: 0.60,
      variableCostGrowth: 0.005,
      fixedCostsLC: 25_000_000,
      depreciationLC: 8_000_000,
      initialCapexUSD: 100_000_000,
      maintenanceCapexRate: 0.03,
      workingCapitalRate: 0.08,
      reinvestmentInterestRate: 0.02,
      reinvestmentRate: 0.10
    },
    policy: {
      localCorporateTax: 0.30,
      repatriationTax: 0.05,
      capitalControls: false,
      forcedReinvestment: false
    },
    macro: {
      spotFX: 0.92,
      expectedDrift: -0.01,
      volatility: 0.06,
      localInflation: 0.02
    }
  },
  {
    id: 'brazil',
    name: 'Brazil',
    projectName: 'Mato Grosso Bio-Ethanol Refinery',
    projectIcon: '🏭',
    currency: 'BRL',
    region: 'Latin America',
    classification: 'Emerging',
    businessType: 'Agri-Tech Infrastructure',
    growthProfile: 'High',
    fxStability: 'Low',
    politicalRisk: 'High',
    repatriationFriction: 'Medium',
    localBorrowingRate: 0.11,
    ops: {
      baseYearRevenueLC: 500_000_000,
      annualGrowthRate: 0.12,
      variableCostRate: 0.55,
      variableCostGrowth: 0.02,
      fixedCostsLC: 80_000_000,
      depreciationLC: 30_000_000,
      initialCapexUSD: 100_000_000,
      maintenanceCapexRate: 0.07,
      workingCapitalRate: 0.15,
      reinvestmentInterestRate: 0.09,
      reinvestmentRate: 0.30
    },
    policy: {
      localCorporateTax: 0.34,
      repatriationTax: 0.10,
      capitalControls: false,
      forcedReinvestment: true
    },
    macro: {
      spotFX: 4.95,
      expectedDrift: 0.05,
      volatility: 0.18,
      localInflation: 0.06
    }
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    projectName: 'Da Nang Silicon Foundry',
    projectIcon: '🔌',
    currency: 'VND',
    region: 'SE Asia',
    classification: 'Frontier',
    businessType: 'Semiconductor Assembly',
    growthProfile: 'High',
    fxStability: 'Medium',
    politicalRisk: 'Medium',
    repatriationFriction: 'High',
    localBorrowingRate: 0.06,
    ops: {
      baseYearRevenueLC: 2_400_000_000_000,
      annualGrowthRate: 0.20,
      variableCostRate: 0.70,
      variableCostGrowth: 0.015,
      fixedCostsLC: 400_000_000_000,
      depreciationLC: 150_000_000_000,
      initialCapexUSD: 100_000_000,
      maintenanceCapexRate: 0.04,
      workingCapitalRate: 0.10,
      reinvestmentInterestRate: 0.04,
      reinvestmentRate: 0.25
    },
    policy: {
      localCorporateTax: 0.20,
      repatriationTax: 0.05,
      capitalControls: true,
      forcedReinvestment: true
    },
    macro: {
      spotFX: 24500,
      expectedDrift: 0.02,
      volatility: 0.07,
      localInflation: 0.04
    }
  },
  {
    id: 'mexico',
    name: 'Mexico',
    projectName: 'Nuevo León EV Components Plant',
    projectIcon: '🏎️',
    currency: 'MXN',
    region: 'North America',
    classification: 'Emerging',
    businessType: 'Automotive Nearshoring',
    growthProfile: 'Medium',
    fxStability: 'Medium',
    politicalRisk: 'Medium',
    repatriationFriction: 'Low',
    localBorrowingRate: 0.095,
    ops: {
      baseYearRevenueLC: 1_800_000_000,
      annualGrowthRate: 0.08,
      variableCostRate: 0.50,
      variableCostGrowth: 0.01,
      fixedCostsLC: 350_000_000,
      depreciationLC: 100_000_000,
      initialCapexUSD: 100_000_000,
      maintenanceCapexRate: 0.06,
      workingCapitalRate: 0.11,
      reinvestmentInterestRate: 0.07,
      reinvestmentRate: 0.15
    },
    policy: {
      localCorporateTax: 0.30,
      repatriationTax: 0.10,
      capitalControls: false,
      forcedReinvestment: false
    },
    macro: {
      spotFX: 17.1,
      expectedDrift: 0.02,
      volatility: 0.12,
      localInflation: 0.04
    }
  }
];
