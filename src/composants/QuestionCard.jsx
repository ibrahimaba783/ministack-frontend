import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuestionCard = ({ question }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); 

    const voter = async (e, type) => {
        e.stopPropagation(); // empeche le clic de naviguer vers le detail
        if (!token) {
            alert('Veuillez vous connecter pour voter');
            return;
        }
        try {
            await axios.put(
                `https://ministack-backend-stpp.onrender.com/api/questions/${question._id}/voter`,
                { type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.location.reload(); // recharger pour voir le nouveau vote
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className="border rounded-lg p-4 shadow cursor-pointer  flex gap-4"
            onClick={() => navigate(`/detail/${question._id}`)}>

            {/* Stats gauche */}
            <div className="flex flex-col items-center justify-start gap-2 min-w-[80px] text-sm text-gray-500">

                {/* boutons vote */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={(e) => voter(e, 'up')}
                        className="text-gray-400 hover:text-green-500 text-xl font-bold">▲</button>
                    <span className="font-bold text-gray-700">{question.votes || 0}</span>
                    <button
                        onClick={(e) => voter(e, 'down')}
                        className="text-gray-400 hover:text-red-500 text-xl font-bold">▼</button>
                    <span>votes</span>
                </div>

                {/* nombre de reponses */}
                <div className={`flex flex-col items-center px-2 py-1 rounded ${question.resolu ? 'bg-green-500 text-white' : ''}`}>
                    <span className="font-bold text-gray-700">{question.nombreReponses || 0}</span>
                    <span>réponses</span>
                </div>

            </div>

            {/* Contenu droite */}
            <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    {question.titre}
                </h2>
                <p className="text-gray-600 text-sm">{question.description}</p>

                {/* tags */}
                <div className="flex gap-2 flex-wrap">
                    {question.tags?.map((tag, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* auteur + date */}
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{question.auteur?.prenom} {question.auteur?.nom}</span>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

        </div>
    );
};

export default QuestionCard;