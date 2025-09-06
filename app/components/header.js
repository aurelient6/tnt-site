// app/components/header.js

import Link from 'next/link';
import '../style/header.css';

export default function Header() {
  return (
    <header>
      <div className="container">
        <div className="logo">
          <a href="/" className="logoText">T&T</a>
        </div>
        <nav>
          <ul className="navList">
            <li className="navItem">
              <a href="/services" className="navLink">Nos services</a>
            </li>
            <li className="navItem">
              <a href="/boutique" className="navLink">Boutique</a>
            </li>
            <li className="navItem">
              <a href="/contact" className="navLink">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}