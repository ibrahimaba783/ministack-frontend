import React from 'react'
import { useNavigate } from 'react-router-dom';
import Questions from './../../composants/Questions';

const Accueil = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const VerificationToken = () => {
        if (token) return navigate('/ajouter_question');
        navigate('/connexion');
    }

    return (
        <div className="w-full">

            {/* Section Hero */}
            <div className="w-full px-6 md:px-10 py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[length:200%_200%] animate-gradient"
                style={{ backgroundImage: 'linear-gradient(120deg, #4f46e5, #7c3aed, #c026d3, #7c3aed, #4f46e5)' }}>

                <div className="text-white">
                    <h1 className="text-2xl md:text-4xl font-bold mb-3">
                        {token && user
                            ? <>Salut <span className="text-yellow-400">{user.prenom} {user.nom}</span>, qu'est-ce que tu veux apprendre aujourd'hui ?</>
                            : <>Bienvenue sur <span className="text-yellow-400">MiniStack</span></>
                        }
                    </h1>
                    <p className="text-blue-100 text-base md:text-lg max-w-md">
                        Posez vos questions, partagez vos connaissances et progressez avec la communauté des développeurs.
                    </p>
                </div>

                <button
                    onClick={VerificationToken}
                    className="bg-white text-purple-600 font-bold px-5 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap w-full md:w-auto justify-center">
                    + Poser une question
                </button>

            </div>

            <Questions />
        </div>
    )
}

export default Accueil