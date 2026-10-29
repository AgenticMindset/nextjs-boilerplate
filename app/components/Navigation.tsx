"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "home" },
    { href: "/career", label: "career" },
    { href: "/blog", label: "blog" },
    { href: "/agents", label: "my agents" },
  ];

  return (
    <nav className="nav">
      <div className="nav__inner">
        {/* Deliberately unlabelled in the design, but it is still a link to
            the home page, so it needs an accessible name. */}
        <Link href="/" className="nav__name">
          <span className="sr-only">Home</span>
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
