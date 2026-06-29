import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profil = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [menuQuestionOuvert, setMenuQuestionOuvert] = useState(null); // id de la question dont le menu est ouvert

    useEffect(() => {
        if (!token) {
            alert('Accès refusé. Veuillez vous connecter.');
            navigate('/connexion');
            return;
        }

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

        const fetchMesQuestions = async () => {
            try {
                const res = await axios.get('https://ministack-backend-stpp.onrender.com/api/questions');
                const mesQuestions = res.data.filter(q => q.auteur?._id === JSON.parse(atob(token.split('.')[1])).id);
                setQuestions(mesQuestions);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProfil();
        fetchMesQuestions();
    }, []);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await axios.post(
                'https://ministack-backend-stpp.onrender.com/api/auth/photo',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setUser(res.data.user);
            setMenuOuvert(false);
        } catch (error) {
            console.log(error);
            alert('Erreur lors de l\'upload');
        }
    };

    const supprimerPhoto = async () => {
        try {
            const res = await axios.put(
                'https://ministack-backend-stpp.onrender.com/api/auth/photo/supprimer',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data.user);
            setMenuOuvert(false);
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la suppression');
        }
    };

    // supprimer une question
    const supprimerQuestion = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette question ?')) return;
        try {
            await axios.delete(`https://ministack-backend-stpp.onrender.com/api/questions/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(questions.filter(q => q._id !== id)); // retirer de la liste
            setMenuQuestionOuvert(null);
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la suppression');
        }
    };

    if (!user) return <p className="p-10">Chargement...</p>;

    const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

    return (
        <div className="w-full p-10 max-w-3xl mx-auto">

            {/* En-tête profil */}
            <div className="flex items-center gap-6 mb-8 border-b pb-6 relative">

                <div className="relative">
                    <button onClick={() => setMenuOuvert(!menuOuvert)} className="relative">
                        {user.photo ? (
                            <img
                                src={user.photo}
                                alt="profil"
                                className="w-20 h-20 rounded-full object-cover hover:opacity-80" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold hover:opacity-80">
                                {initiales}
                            </div>
                        )}
                    </button>

                    {menuOuvert && (
                    <div className="absolute top-24 left-0 bg-white border rounded-lg shadow-lg w-48 z-10 overflow-hidden">
                        <label className="block px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm font-medium border-b">
                            📷 {user.photo ? "Changer la photo" : "Ajouter une photo"}
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </label>

                        {user.photo && (
                            <button
                                onClick={supprimerPhoto}
                                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-medium">
                                🗑️ Supprimer la photo
                            </button>
                        )}

                        <button
                            onClick={() => setMenuOuvert(false)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-400 text-sm">
                            Annuler
                        </button>
                    </div>
                )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold">{user.prenom} {user.nom}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Membre depuis le {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>

            </div>

            {/* Mes questions */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Mes questions ({questions.length})</h2>
                <button
                    onClick={() => navigate('/ajouter_question')}
                    className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700">
                    + Ajouter une question
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {questions.length === 0 ? (
                    <p className="text-gray-400">Vous n'avez posé aucune question.</p>
                ) : (
                    questions.map((question) => (
                        <div
                            key={question._id}
                            className="border rounded-lg p-4 shadow relative hover:border-purple-400">

                            <div className="flex justify-between items-start">
                                <div
                                    onClick={() => navigate(`/detail/${question._id}`)}
                                    className="flex-1 cursor-pointer">
                                    <h3 className="font-semibold text-blue-600">{question.titre}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{question.description}</p>
                                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                                        <span>{question.votes || 0} votes</span>
                                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* menu trois points */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuQuestionOuvert(menuQuestionOuvert === question._id ? null : question._id);
                                        }}
                                        className="text-gray-400 hover:text-gray-700 px-2">
                                        ⋮
                                    </button>

                                    {menuQuestionOuvert === question._id && (
                                        <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg w-44 z-10 overflow-hidden">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/modifier_question/${question._id}`);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm font-medium border-b">
                                                ✏️ Modifier
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    supprimerQuestion(question._id);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-medium">
                                                🗑️ Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Profil