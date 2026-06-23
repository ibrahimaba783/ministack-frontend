import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profil = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);

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

    // gerer le changement de photo
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
            setUser(res.data.user); // mettre a jour avec la nouvelle photo
        } catch (error) {
            console.log(error);
            alert('Erreur lors de l\'upload');
        }
    };

    if (!user) return <p className="p-10">Chargement...</p>;

    const initiales = `${user.prenom[0]}${user.nom[0]}`.toUpperCase();

    return (
        <div className="w-full p-10 max-w-3xl mx-auto">

            {/* En-tête profil */}
            <div className="flex items-center gap-6 mb-8 border-b pb-6">

                {/* Avatar avec upload */}
                <label className="relative cursor-pointer group">
                    {user.photo ? (
                        <img
                            src={`https://ministack-backend-stpp.onrender.com${user.photo}`}
                            alt="profil"
                            className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold">
                            {initiales}
                        </div>
                    )}
                    
                    {/* overlay au survol */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold">Changer</span>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange} />
                </label>

                <div>
                    <h1 className="text-2xl font-bold">{user.prenom} {user.nom}</h1>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Membre depuis le {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>

            </div>

            {/* Mes questions */}
            <h2 className="text-xl font-bold mb-4">Mes questions ({questions.length})</h2>
            <div className="flex flex-col gap-4">
                {questions.length === 0 ? (
                    <p className="text-gray-400">Vous n'avez posé aucune question.</p>
                ) : (
                    questions.map((question) => (
                        <div
                            key={question._id}
                            onClick={() => navigate(`/detail/${question._id}`)}
                            className="border rounded-lg p-4 shadow cursor-pointer hover:border-purple-400">
                            <h3 className="font-semibold text-blue-600">{question.titre}</h3>
                            <p className="text-gray-600 text-sm mt-1">{question.description}</p>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>{question.votes || 0} votes</span>
                                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Profil