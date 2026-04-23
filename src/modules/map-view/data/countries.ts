export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  center: [number, number];
  zoom: number;
  currencySymbol: string;
  currency: string;
}

/**
 * Add a new country here to extend the map to that market.
 * No other code changes required.
 */
export const COUNTRIES: CountryConfig[] = [
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    center: [6.5244, 3.3792],
    zoom: 12,
    currencySymbol: "₦",
    currency: "NGN",
  },
  {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",
    center: [5.6037, -0.1870],
    zoom: 12,
    currencySymbol: "₵",
    currency: "GHS",
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    center: [-1.2921, 36.8219],
    zoom: 12,
    currencySymbol: "KSh",
    currency: "KES",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    center: [-26.2041, 28.0473],
    zoom: 12,
    currencySymbol: "R",
    currency: "ZAR",
  },
  {
    code: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    center: [30.0444, 31.2357],
    zoom: 12,
    currencySymbol: "E£",
    currency: "EGP",
  },
];

export const ALL_COUNTRIES_VIEW: { center: [number, number]; zoom: number } = {
  center: [5.0, 20.0],
  zoom: 4,
};

export function getCountry(code: string): CountryConfig | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
