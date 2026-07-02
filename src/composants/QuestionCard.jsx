import { useNavigate } from 'react-router-dom';

const QuestionCard = ({ question }) => {
    const navigate = useNavigate();

    return (
        <div
            className="border rounded-lg p-3 md:p-4 shadow cursor-pointer flex gap-3 md:gap-4"
            onClick={() => navigate(`/detail/${question._id}`)}>

            {/* Stats gauche — plus compact sur mobile */}
            <div className="flex flex-col items-center justify-start gap-2 min-w-[60px] md:min-w-[80px] text-xs md:text-sm text-gray-500">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-700">{question.votes || 0}</span>
                    <span>votes</span>
                </div>
                <div className={`flex flex-col items-center px-1 py-1 rounded ${question.resolu ? 'bg-green-500 text-white' : ''}`}>
                    <span className="font-bold text-gray-700">{question.nombreReponses || 0}</span>
                    <span>rép.</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-700">{question.vues || 0}</span>
                    <span>vues</span>
                </div>
            </div>

            {/* Contenu droite */}
            <div className="flex flex-col gap-1 md:gap-2 flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-semibold text-blue-600 hover:text-blue-800 leading-tight">
                    {question.titre}
                </h2>
                <p className="text-gray-600 text-xs md:text-sm line-clamp-2">{question.description}</p>
                <div className="flex gap-1 md:gap-2 flex-wrap">
                    {question.tags?.map((tag, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>{question.auteur?.prenom} {question.auteur?.nom}</span>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;