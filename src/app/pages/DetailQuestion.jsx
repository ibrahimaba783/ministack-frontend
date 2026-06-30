import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const DetailQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const [question, setQuestion] = useState(null);
    const [reponses, setReponses] = useState([]);
    const [contenu, setContenu] = useState('');
    const [votes, setVotes] = useState(0);
    const [modeEdition, setModeEdition] = useState(false);
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    // edition d'une reponse
    const [reponseEnEdition, setReponseEnEdition] = useState(null); // id de la reponse en cours d'edition
    const [contenuEdition, setContenuEdition] = useState('');

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.get(`https://ministack-backend-stpp.onrender.com/api/questions/${id}`);
                setQuestion(res.data);
                setVotes(res.data.votes || 0);
                setTitre(res.data.titre);
                setDescription(res.data.description);
                setTags(res.data.tags?.join(', ') || '');

                const rep = await axios.get(`https://ministack-backend-stpp.onrender.com/api/reponses/${id}`);
                setReponses(rep.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchQuestion();
    }, [id]);

    const voter = async (type) => {
        if (!token) {
            alert('Veuillez vous connecter pour voter');
            return;
        }
        try {
            const res = await axios.put(
                `https://ministack-backend-stpp.onrender.com/api/questions/${id}/voter`,
                { type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVotes(res.data.votes);
        } catch (error) {
            console.log(error);
        }
    };

    const handleReponse = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://ministack-backend-stpp.onrender.com/api/reponses/${id}`,
                { contenu },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // ajouter la nouvelle reponse a la liste sans recharger
            setReponses([...reponses, res.data.reponse]);
            setContenu('');
        } catch (error) {
            console.log(error);
            alert('Erreur');
        }
    };

    const handleModifier = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `https://ministack-backend-stpp.onrender.com/api/questions/${id}`,
                { titre, description, tags: tags.split(',').map(t => t.trim()) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestion(res.data.question);
            setModeEdition(false);
            alert('Question modifiée !');
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la modification');
        }
    };

    const handleSupprimer = async () => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette question ?')) return;
        try {
            await axios.delete(
                `https://ministack-backend-stpp.onrender.com/api/questions/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Question supprimée !');
            navigate('/');
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la suppression');
        }
    };

    // modifier une reponse
    const handleModifierReponse = async (reponseId) => {
        try {
            const res = await axios.put(
                `https://ministack-backend-stpp.onrender.com/api/reponses/${reponseId}`,
                { contenu: contenuEdition },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // mettre a jour la reponse dans la liste
            setReponses(reponses.map(r => r._id === reponseId ? res.data.reponse : r));
            setReponseEnEdition(null);
            setContenuEdition('');
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la modification');
        }
    };

    // supprimer une reponse
    const handleSupprimerReponse = async (reponseId) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette réponse ?')) return;
        try {
            await axios.delete(
                `https://ministack-backend-stpp.onrender.com/api/reponses/${reponseId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // retirer la reponse de la liste
            setReponses(reponses.filter(r => r._id !== reponseId));
        } catch (error) {
            console.log(error);
            alert('Erreur lors de la suppression');
        }
    };

    if (!question) return <p className="p-10">Chargement...</p>;

    const estAuteur = user && question.auteur && user.id === question.auteur._id;

    return (
        <div className="w-full p-10">

            {/* Question avec boutons vote */}
            <div className="border rounded-lg p-6 shadow mb-8 flex gap-4">

                {/* boutons vote */}
                <div className="flex flex-col items-center min-w-[60px] text-sm text-gray-500">
                    <button
                        onClick={() => voter('up')}
                        className="text-gray-400 hover:text-green-500 text-2xl font-bold">▲</button>
                    <span className="font-bold text-gray-700 text-lg">{votes}</span>
                    <button
                        onClick={() => voter('down')}
                        className="text-gray-400 hover:text-red-500 text-2xl font-bold">▼</button>
                    <span>votes</span>
                </div>

                {/* contenu question */}
                <div className="flex-1">
                    {modeEdition ? (
                        <form onSubmit={handleModifier} className="flex flex-col gap-3">
                            <input
                                className="border py-2 px-3 border-black rounded"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)} />
                            <textarea
                                className="border py-2 px-3 border-black rounded h-24"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} />
                            <input
                                className="border py-2 px-3 border-black rounded"
                                placeholder="Tags séparés par des virgules"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)} />
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded font-bold hover:bg-blue-600">
                                    Enregistrer
                                </button>
                                <button type="button" onClick={() => setModeEdition(false)} className="bg-gray-300 py-2 px-4 rounded font-bold hover:bg-gray-400">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold mb-2">{question.titre}</h1>
                            <p className="text-gray-600 mb-4">{question.description}</p>
                            <div className="flex gap-2">
                                {question.tags?.map((tag, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                        <span>{question.auteur?.prenom} {question.auteur?.nom}</span>
                        <span>{question.vues || 0} vues · {new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>

                    {estAuteur && !modeEdition && (
                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={() => setModeEdition(true)}
                                className="text-blue-600 text-sm font-semibold hover:underline">
                                Modifier
                            </button>
                            <button
                                onClick={handleSupprimer}
                                className="text-red-600 text-sm font-semibold hover:underline">
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reponses */}
            <h2 className="text-xl font-bold mb-4">{reponses.length} Réponses</h2>
            <div className="flex flex-col gap-4 mb-8">
                {reponses.map((reponse) => {
                    const estAuteurReponse = user && reponse.auteur && user.id === reponse.auteur._id;
                    return (
                        <div key={reponse._id} className="border rounded-lg p-4 shadow">

                            {/* mode edition de la reponse */}
                            {reponseEnEdition === reponse._id ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        className="border py-2 px-3 border-black rounded h-24"
                                        value={contenuEdition}
                                        onChange={(e) => setContenuEdition(e.target.value)} />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleModifierReponse(reponse._id)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded text-sm font-bold hover:bg-blue-600">
                                            Enregistrer
                                        </button>
                                        <button
                                            onClick={() => setReponseEnEdition(null)}
                                            className="bg-gray-300 py-1 px-3 rounded text-sm font-bold hover:bg-gray-400">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-700">{reponse.contenu}</p>
                                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                                        <span>{reponse.auteur?.prenom} {reponse.auteur?.nom}</span>
                                        <span>{new Date(reponse.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {/* boutons modifier/supprimer visibles seulement pour l'auteur */}
                                    {estAuteurReponse && (
                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => {
                                                    setReponseEnEdition(reponse._id);
                                                    setContenuEdition(reponse.contenu);
                                                }}
                                                className="text-blue-600 text-sm font-semibold hover:underline">
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleSupprimerReponse(reponse._id)}
                                                className="text-red-600 text-sm font-semibold hover:underline">
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Formulaire reponse */}
            {token && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Votre réponse</h3>
                    <form onSubmit={handleReponse} className="flex flex-col gap-4">
                        <textarea
                            className="border py-2 px-3 border-black rounded h-32"
                            placeholder="Écrivez votre réponse..."
                            value={contenu}
                            onChange={(e) => setContenu(e.target.value)} />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded font-bold hover:bg-blue-600 w-fit">
                            Publier la réponse
                        </button>
                    </form>
                </div>
            )}

        </div>
    )
}

export default DetailQuestion