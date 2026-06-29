import { useNavigate } from 'react-router-dom';

const QuestionCard = ({ question }) => {
    const navigate = useNavigate();

    return (
        <div
            className="border rounded-lg p-4 shadow cursor-pointer flex gap-4"
            onClick={() => navigate(`/detail/${question._id}`)}>

            {/* Stats gauche */}
            <div className="flex flex-col items-center justify-start gap-2 min-w-[80px] text-sm text-gray-500">

                {/* score simple sans boutons */}
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-700">{question.votes || 0}</span>
                    <span>votes</span>
                </div>

                {/* nombre de reponses */}
                <div className={`flex flex-col items-center px-2 py-1 rounded ${question.resolu ? 'bg-green-500 text-white' : ''}`}>
                    <span className="font-bold text-gray-700">{question.nombreReponses || 0}</span>
                    <span>réponses</span>
                </div>

                {/* nombre de vues */}
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-700">{question.vues || 0}</span>
                    <span>vues</span>
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