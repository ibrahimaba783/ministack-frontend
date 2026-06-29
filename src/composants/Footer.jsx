const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6">

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          
          <div>
            <div className="flex items-center gap-2 mb-4">
                <img src="/image.png" alt="MiniStack" className="h-8" />
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="hover:text-white cursor-pointer">Questions</span></li>
              <li><span className="hover:text-white cursor-pointer">Aide</span></li>
              <li><span className="hover:text-white cursor-pointer">Chat</span></li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase">Entreprise</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="hover:text-white cursor-pointer">Pile interne</span></li>
              <li><span className="hover:text-white cursor-pointer">Licence de données</span></li>
            </ul>
          </div>

         
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase">Entreprise</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="hover:text-white cursor-pointer">À propos</span></li>
              <li><span className="hover:text-white cursor-pointer">Presse</span></li>
              <li><span className="hover:text-white cursor-pointer">Contactez-nous</span></li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase">Réseau Stack Exchange</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="hover:text-white cursor-pointer">Technologie</span></li>
              <li><span className="hover:text-white cursor-pointer">Culture et loisirs</span></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className=" pt-6 text-xs text-gray-500 flex flex-wrap gap-4">
          <span>Facebook</span>
          <span>LinkedIn</span>
          <span>Instagram</span>
          <p className="w-full mt-2">© 2026 MiniStack — Contributions des utilisateurs sous licence CC BY-SA</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer