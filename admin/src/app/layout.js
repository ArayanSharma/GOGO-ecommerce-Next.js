import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Dsidebar from "./components/Dsidebar";
import Dheader from "./components/Dheader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GOGO Admin Dashboard",
  description: "Green and yellow themed admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      
      <body className="admin-shell min-h-screen text-slate-800 h-screen overflow-hidden">
        {/* Main Container */}
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="sidebar-container fixed md:static left-0 top-0 h-screen z-40 md:z-0 w-64">
            <Dsidebar />
          </div>

          {/* Main Content Area */}
          <div className="main-content flex-1 flex flex-col overflow-hidden md:ml-0 h-screen">
            {/* Header */}
            <div className="header-container sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-emerald-100/90">
              <Dheader />
            </div>

            {/* Content */}
            <div className="content-wrapper flex-1 overflow-y-auto">
              <div className="content-inner p-6 lg:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
