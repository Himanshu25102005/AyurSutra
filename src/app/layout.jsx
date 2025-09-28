import { Inter, Poppins, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Ayursutra - AI-Powered Ayurvedic Nutrition Platform",
  description: "Experience personalized Ayurvedic nutrition powered by AI. Trusted by dietitians, designed for patients. Discover your Prakriti and get customized diet plans.",
  keywords: "Ayurveda, nutrition, AI, dietitian, personalized diet, Prakriti analysis, holistic health",
  authors: [{ name: "Ayursutra Team" }],
  openGraph: {
    title: "Ayursutra - AI-Powered Ayurvedic Nutrition",
    description: "Experience personalized Ayurvedic nutrition powered by AI",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${notoSerifDevanagari.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
