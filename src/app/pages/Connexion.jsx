import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Connexion = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const Laconnexion = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const data = { email, password };

    try {
      const response = await fetch("https://ministack-backend-stpp.onrender.com/api/auth/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        alert(`Connexion réussie ${result.user.prenom} ${result.user.nom}`);
        navigate('/');
      } else {
        alert(result.message || "Identifiants incorrects");
      }

    } catch (error) {
      console.error(error);
      alert("Erreur serveur. Veuillez réessayer.");
    }
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">

        <h1 className="text-center font-bold text-2xl text-gray-800 mb-1">Connexion</h1>
        

        <form onSubmit={Laconnexion} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input
              className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-purple-500"
              type="email"
              placeholder="exemple@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
            <input
              className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-purple-500"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg mt-4 hover:opacity-90">
            Se connecter
          </button>

          <Link to="/inscription" className="text-center text-sm hover:underline">
            <span className="text-gray-500">Pas de compte ? </span>
            <span className="text-green-600 font-semibold">S'inscrire</span>
        </Link>

        </form>

      </div>

    </div>
  )
}

export default Connexion