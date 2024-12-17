import React from "react";

function Footer() {
  return (
    <footer className="bg-blue-800 text-white shadow-lg">
      <div className="container flex flex-col md:flex-row justify-between items-center px2 py-4 mx-auto">
        {/* Footer Title */}
        <h1 className="font-bold">
          &copy; All rights reserved by iSpardha {new Date().getFullYear()}
        </h1>

        {/* Optional Links */}
        {/* <div className="mt-2 md:mt-0">
          <a
            href="/privacy-policy"
            className="text-yellow-500 hover:text-yellow-400 px-2"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="text-yellow-500 hover:text-yellow-400 px-2"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-yellow-500 hover:text-yellow-400 px-2"
          >
            Contact Us
          </a>
        </div> */}
      </div>
    </footer>
  );
}

export default Footer;
