import React from 'react';
import { BarChart3 } from 'lucide-react';
const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} <BarChart3 className="h-8 w-8 text-black" /> Data Darshan. All rights reserved.</p>
        <p>Designed for seamless data analysis and visualization.</p>
        {/* <nav className="footer-nav">
          <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a> | <a href="#contact">Contact Us</a>
        </nav> */}
      </div>
    </footer>
  );
};

export default Footer;