import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfil = async () => {
      try {
        const res = await axios.get('https://ministack-backend-stpp.onrender.com/api/auth/profil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfil();

    // rafraichir quand le profil est modifie ailleurs (page Profil)
    window.addEventListener('profilMisAJour', fetchProfil);
    return () => window.removeEventListener('profilMisAJour', fetchProfil);
  }, [token]);

  const Deconnexion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert('deconnexion reussie')
    navigate('/')
  }

  const initiales = user ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : '';

  return (
    <nav className="bg-blue border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
          <img src="/image.png" alt="MiniStack" className="h-8" />
      </Link>

      {/* Liens navigation */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">
          Accueil
        </Link>
        <NavLink to="/profil" className="text-gray-600 hover:text-blue-600 text-sm">
          Profil
        </NavLink>
      </div>

      {/* Boutons auth */}
      <div className="flex items-center gap-3">
        {token ? (
          <>
            {/* Avatar utilisateur, lien vers le profil */}
            <Link to="/profil" className="flex items-center gap-2">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="profil"
                  className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  {initiales}
                </div>
              )}
              {user && (
                <span className="text-sm text-gray-700 hidden sm:inline">{user.prenom}</span>
              )}
            </Link>

            <button
              onClick={() => Deconnexion()}
              className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">
              Se déconnecter
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/connexion"
              className="border border-blue-500 text-blue-500 px-4 py-1 rounded text-sm hover:bg-blue-50">
              Connexion
            </Link>
            <Link to="/inscription"
              className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600">
              Inscription
            </Link>
          </div>
        )}
      </div>

    </nav>
  )
}

export default Navbar