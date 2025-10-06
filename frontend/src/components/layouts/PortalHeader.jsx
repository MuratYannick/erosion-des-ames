import { useState } from "react";
import { Link } from "react-router-dom";
import BurgerButton from "../ui/BurgerButton";
import BurgerPanel from "../ui/BurgerPanel";
import ConnectBar from "../ui/ConnectBar";
import Navbar from "../ui/Navbar";

function PortalHeader() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <header className="bg-city-900 flex flex-col relative">
      <div className="bg-city-900 flex w-full items-center relative xl:sticky xl:top-0 gap-2 p-2 z-50">
        <BurgerButton
          menuIsOpen={menuIsOpen}
          onClick={() => setMenuIsOpen(!menuIsOpen)}
        />

        {/* Logo + Title */}
        <div className="flex flex-col lg:flex-row lg:items-center grow gap-2">
          <Link
            to="/"
            className="flex justify-center items-center grow gap-2 py-2"
          >
            <img
              src="/logos/logo.png"
              alt="logo Érosion des Âmes"
              className="flex size-12 sm:size-16 md:size-20 lg:size-24 xl:size-28 2xl:size-32"
            />
            <p className="text-blood-700 font-titre-Jeu text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              L'Érosion des Âmes
            </p>
          </Link>

          <Navbar />
          <ConnectBar />
        </div>
      </div>

      {/* Container du panneau et de la bannière */}
      <div className="relative w-full pb-4">
        <BurgerPanel menuIsOpen={menuIsOpen} />

        <img src="/images/banner.png" alt="vue d'une ville en ruine" className="w-full" />
      </div>
    </header>
  );
}

export default PortalHeader;
