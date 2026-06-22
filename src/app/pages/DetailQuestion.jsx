import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const DetailQuestion = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [question, setQuestion] = useState(null);
    const [reponses, setReponses] = useState([]);
    const [contenu, setContenu] = useState('');
    const [votes, setVotes] = useState(0); // votes locaux

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.get(`https://ministack-backend-stpp.onrender.com/api/questions/${id}`);
                setQuestion(res.data);
                setVotes(res.data.votes || 0); // initialiser les votes

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
            setVotes(res.data.votes); // mise a jour instantanee
        } catch (error) {
            console.log(error);
        }
    };

    const handleReponse = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`https://ministack-backend-stpp.onrender.com/api/reponses/${id}`,
                { contenu },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Réponse ajoutée !');
            setContenu('');
        } catch (error) {
            console.log(error);
            alert('Erreur');
        }
    };

    if (!question) return <p className="p-10">Chargement...</p>;

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
                    <h1 className="text-2xl font-bold mb-2">{question.titre}</h1>
                    <p className="text-gray-600 mb-4">{question.description}</p>
                    <div className="flex gap-2">
                        {question.tags?.map((tag, i) => (
                            <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-gray-500">
                        <span>{question.auteur?.prenom} {question.auteur?.nom}</span>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

            </div>

            {/* Reponses */}
            <h2 className="text-xl font-bold mb-4">{reponses.length} Réponses</h2>
            <div className="flex flex-col gap-4 mb-8">
                {reponses.map((reponse) => (
                    <div key={reponse._id} className="border rounded-lg p-4 shadow">
                        <p className="text-gray-700">{reponse.contenu}</p>
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span>{reponse.auteur?.prenom} {reponse.auteur?.nom}</span>
                            <span>{new Date(reponse.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
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