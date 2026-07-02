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

    // edition des infos du profil
    const [modeEditionProfil, setModeEditionProfil] = useState(false);
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');

    // changement de mot de passe
    const [modeMotDePasse, setModeMotDePasse] = useState(false);
    const [ancienMotDePasse, setAncienMotDePasse] = useState('');
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');

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
                setPrenom(res.data.prenom);
                setNom(res.data.nom);
                setEmail(res.data.email);
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
            window.dispatchEvent(new Event('profilMisAJour')); // notifier la Navbar
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
            window.dispatchEvent(new Event('profilMisAJour')); // notifier la Navbar
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la suppression');
        }
    };

    // modifier les infos du profil
    const handleModifierProfil = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                'https://ministack-backend-stpp.onrender.com/api/auth/profil',
                { prenom, nom, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data.user);

            // on met aussi a jour le localStorage pour que la Navbar reste a jour
            const userLocal = JSON.parse(localStorage.getItem("user"));
            localStorage.setItem("user", JSON.stringify({ ...userLocal, prenom, nom, email }));

            // prevenir les autres composants (Navbar) que le profil a change
            window.dispatchEvent(new Event('profilMisAJour'));

            setModeEditionProfil(false);
            alert('Profil mis à jour !');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    // changer le mot de passe
    const handleChangerMotDePasse = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                'https://ministack-backend-stpp.onrender.com/api/auth/mot-de-passe',
                { ancienMotDePasse, nouveauMotDePasse },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAncienMotDePasse('');
            setNouveauMotDePasse('');
            setModeMotDePasse(false);
            alert('Mot de passe modifié avec succès !');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
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
            <div className="flex items-center gap-6 mb-4 relative">

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

                {!modeEditionProfil && (
                    <div>
                        <h1 className="text-2xl font-bold">{user.prenom} {user.nom}</h1>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Membre depuis le {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                )}

            </div>

            {/* formulaire d'edition du profil */}
            {modeEditionProfil ? (
                <form onSubmit={handleModifierProfil} className="flex flex-col gap-3 mb-6 max-w-md">
                    <input
                        className="border py-2 px-3 border-gray-300 rounded"
                        placeholder="Prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)} />
                    <input
                        className="border py-2 px-3 border-gray-300 rounded"
                        placeholder="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)} />
                    <input
                        className="border py-2 px-3 border-gray-300 rounded"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <div className="flex gap-2">
                        <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded font-bold hover:bg-purple-700">
                            Enregistrer
                        </button>
                        <button type="button" onClick={() => setModeEditionProfil(false)} className="bg-gray-200 py-2 px-4 rounded font-bold hover:bg-gray-300">
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex gap-4 mb-6 pb-6 border-b">
                    <button
                        onClick={() => setModeEditionProfil(true)}
                        className="text-purple-600 text-sm font-semibold hover:underline">
                        ✏️ Modifier mes informations
                    </button>
                    <button
                        onClick={() => setModeMotDePasse(!modeMotDePasse)}
                        className="text-purple-600 text-sm font-semibold hover:underline">
                        🔒 Changer le mot de passe
                    </button>
                </div>
            )}

            {/* formulaire de changement de mot de passe */}
            {modeMotDePasse && !modeEditionProfil && (
                <form onSubmit={handleChangerMotDePasse} className="flex flex-col gap-3 mb-6 max-w-md pb-6 border-b">
                    <input
                        className="border py-2 px-3 border-gray-300 rounded"
                        type="password"
                        placeholder="Ancien mot de passe"
                        value={ancienMotDePasse}
                        onChange={(e) => setAncienMotDePasse(e.target.value)} />
                    <input
                        className="border py-2 px-3 border-gray-300 rounded"
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={nouveauMotDePasse}
                        onChange={(e) => setNouveauMotDePasse(e.target.value)} />
                    <div className="flex gap-2">
                        <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded font-bold hover:bg-purple-700">
                            Confirmer
                        </button>
                        <button type="button" onClick={() => setModeMotDePasse(false)} className="bg-gray-200 py-2 px-4 rounded font-bold hover:bg-gray-300">
                            Annuler
                        </button>
                    </div>
                </form>
            )}

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
                className="group relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-teal-600"
            >
                {/* cercle animé */}
                <div className="absolute -top-5 -right-5 h-10 w-10 rounded-full bg-teal-600 transition-all duration-500 ease-out group-hover:scale-[22]"></div>

                <div className="relative z-10 flex justify-between items-start p-5">

                    {/* contenu */}
                    <div
                        onClick={() => navigate(`/detail/${question._id}`)}
                        className="flex-1 cursor-pointer"
                    >
                        <h3 className="font-bold text-lg text-blue-600 transition-colors duration-300 group-hover:text-white">
                            {question.titre}
                        </h3>

                        <p className="text-gray-600 text-sm mt-2 transition-colors duration-300 group-hover:text-white/90">
                            {question.description}
                        </p>

                        <div className="flex justify-between mt-4 text-xs text-gray-400 transition-colors duration-300 group-hover:text-white/80">
                            <span>{question.votes || 0} votes</span>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* menu 3 points */}
                    <div className="relative z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuQuestionOuvert(menuQuestionOuvert === question._id ? null : question._id);
                            }}
                            className="text-gray-400 transition-colors duration-300 hover:text-white group-hover:text-white px-2"
                        >
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