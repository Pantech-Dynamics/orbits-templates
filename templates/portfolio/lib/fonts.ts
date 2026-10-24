import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

// Self-hosted at build. orbit.css reads them through --font-body and --font-code, set in globals.css.
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", display: "swap", preload: false });

export const FONTS = `${hanken.variable} ${jetbrains.variable}`;
