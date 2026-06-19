import React from 'react'
import { useNavigate } from 'react-router-dom';
import Questions from './../../composants/Questions';

const Accueil = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const VerificationToken = () => {
        if (token) {
            return navigate('/ajouter_question');
        }
        navigate('/connexion')
    }

    return (
        <div className="w-full">

            {/* Section Hero */}
            <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-12 flex items-center justify-between">
                
                {/* Texte gauche */}
                <div className="text-white">
                    <h1 className="text-4xl font-bold mb-3">
                        Bienvenue sur <span className="text-yellow-400">MiniStack</span> 
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md">
                        Posez vos questions, partagez vos connaissances et progressez avec la communauté des développeurs.
                    </p>
                </div>

                {/* Bouton droite */}
                <button
                    onClick={VerificationToken}
                    className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap">
                    + Poser une question
                </button>

            </div>

            {/* Composant des questions */}
            <Questions />

        </div>
    )
}

export default Accueil