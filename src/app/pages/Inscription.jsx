import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Inscription = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/auth/inscription', formData);
            alert('Inscription réussie !');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">

                <h1 className="text-center font-bold text-2xl text-gray-800 mb-1">Inscription</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Prénom</label>
                        <input
                            className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-purple-500"
                            type="text" name="prenom" placeholder="Prénom" onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Nom</label>
                        <input
                            className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-purple-500"
                            type="text" name="nom" placeholder="Nom" onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <input
                            className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-purple-500"
                            type="email" name="email" placeholder="exemple@gmail.com" onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
                        <input
                            className="border border-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:border-purple-500"
                            type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg mt-4 hover:opacity-90">
                        S'inscrire
                    </button>

                    <Link to="/" className="text-center text-sm hover:underline">
                        <span className="text-gray-500">Déjà un compte ? </span>
                        <span className="text-green-600 font-semibold">Se connecter</span>
                    </Link>

                </form>

            </div>

        </div>
    )
}

export default Inscription