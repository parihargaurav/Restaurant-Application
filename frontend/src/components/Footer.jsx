/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="banner">
          <div className="left">DineEase</div>
          <div className="right">
            <p>Jodhpur, Rajasthan</p>
            <p>Open: 10:00 AM - 11:00 PM</p>
            <p>Contact Us: <a href="mailto:parihargaurav527@gmail.com">parihargaurav527@gmail.com</a></p>
            <p>Phone: <a href="tel:+919571169315">+91 95711 69315</a></p>
          </div>
        </div>
        <div className="banner">
          <div className="left">
            <p>Developed By <strong>Gaurav Parihar</strong></p>
          </div>
          <div className="right">
            <p>© {new Date().getFullYear()} <strong>DineEase</strong>. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
