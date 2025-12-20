import React, { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <span className="text-xl font-bold text-white">&lt;Dac/<span className="text-sky-500">Dac</span>&gt;</span>
          </div>
          
          {/* Menú Escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Inicio', 'Servicios', 'Portafolio', 'Precios'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-sky-500 transition-colors px-3 py-2 rounded-md text-sm font-medium text-slate-300">
                  {item}
                </a>
              ))}
              <a href="#contacto" className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                Contrátame
              </a>
            </div>
          </div>

          {/* Botón Móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Inicio', 'Servicios', 'Portafolio', 'Precios'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item}
              </a>
            ))}
            <a href="#contacto" onClick={() => setIsOpen(false)} className="text-sky-500 font-bold block px-3 py-2 rounded-md text-base">
              Contrátame
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};