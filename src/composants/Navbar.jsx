import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [menuOuvert, setMenuOuvert] = useState(false); // menu hamburger mobile

  useEffect(() => {
    if (!token) return;
    const fetchProfil = async () => {
      try {
        const res = await axios.get('https://ministack-backend-stpp.onrender.com/api/auth/profil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) { console.log(error); }
    };
    fetchProfil();
    window.addEventListener('profilMisAJour', fetchProfil);
    return () => window.removeEventListener('profilMisAJour', fetchProfil);
  }, [token]);

  const Deconnexion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert('deconnexion reussie');
    navigate('/');
  }

  const initiales = user ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : '';

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/image.png" alt="MiniStack" className="h-8" />
        </Link>

        {/* Liens navigation — cachés sur mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">Accueil</Link>
          <NavLink to="/profil" className="text-gray-600 hover:text-blue-600 text-sm">Profil</NavLink>
        </div>

        {/* Boutons auth — cachés sur mobile */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <Link to="/profil" className="flex items-center gap-2">
                {user?.photo ? (
                  <img src={user.photo} alt="profil" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                    {initiales}
                  </div>
                )}
                {user && <span className="text-sm text-gray-700">{user.prenom}</span>}
              </Link>
              <button onClick={Deconnexion} className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/connexion" className="border border-blue-500 text-blue-500 px-4 py-1 rounded text-sm hover:bg-blue-50">Connexion</Link>
              <Link to="/inscription" className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600">Inscription</Link>
            </div>
          )}
        </div>

        {/* Bouton hamburger — visible seulement sur mobile */}
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="md:hidden text-gray-600 text-2xl focus:outline-none">
          {menuOuvert ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {menuOuvert && (
        <div className="md:hidden mt-3 flex flex-col gap-3 pb-3 border-t pt-3">
          <Link to="/" onClick={() => setMenuOuvert(false)} className="text-gray-600 hover:text-blue-600 text-sm">Accueil</Link>
          <NavLink to="/profil" onClick={() => setMenuOuvert(false)} className="text-gray-600 hover:text-blue-600 text-sm">Profil</NavLink>

          {token ? (
            <>
              <Link to="/profil" onClick={() => setMenuOuvert(false)} className="flex items-center gap-2">
                {user?.photo ? (
                  <img src={user.photo} alt="profil" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                    {initiales}
                  </div>
                )}
                {user && <span className="text-sm text-gray-700">{user.prenom}</span>}
              </Link>
              <button onClick={Deconnexion} className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 w-fit">
                Se déconnecter
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/connexion" onClick={() => setMenuOuvert(false)} className="border border-blue-500 text-blue-500 px-4 py-1 rounded text-sm hover:bg-blue-50">Connexion</Link>
              <Link to="/inscription" onClick={() => setMenuOuvert(false)} className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600">Inscription</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar