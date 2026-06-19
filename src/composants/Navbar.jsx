import { Link, NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const Deconnexion = () => {
    localStorage.removeItem("token");
    alert('deconnexion reussie')
    navigate('/')
  }

  return (
    <nav className="bg-blue border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="font-bold text-gray-800 text-lg">LOGO</span>
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
      <div className="flex items-center gap-2">
        {token ? (
          <button
            onClick={() => Deconnexion()}
            className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">
            Se déconnecter
          </button>
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