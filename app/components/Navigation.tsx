"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "home" },
    { href: "/work", label: "work" },
  ];

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__name">
          Álvaro Tomás
        </Link>
        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav__link ${
                  pathname === link.href ? "nav__link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
