'use client';
import "./globals.css";

import Navbar from '../components/Navbar';
import { Toaster } from "../components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <Toaster /> {/* <- You need this */}
      <Navbar />
      {children}
    </>
  );
}
