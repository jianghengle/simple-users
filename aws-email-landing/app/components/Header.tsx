"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const solutions = [
  { name: "Claw EC2", href: "https://ec2.bee-archi.com" },
  { name: "AWS WorkMail Migration", href: "/aws-email-migration" },
  { name: "Myworkflowhub.com", href: "https://myworkflowhub.com" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Company Name */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            Bee-Archi
          </Link>

          {/* Solutions Dropdown */}
          <nav className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              Solutions
              <svg
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {solutions.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
