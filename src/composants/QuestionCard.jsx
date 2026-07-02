import { useNavigate } from "react-router-dom";

const colors = [
  "from-rose-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
];

const QuestionCard = ({ question }) => {
  const navigate = useNavigate();

  const gradient =
    colors[
      question.titre?.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
        colors.length
    ];

  return (
    <div
      onClick={() => navigate(`/detail/${question._id}`)}
      className="
      group
      cursor-pointer
      rounded-2xl
      bg-white
      shadow-md
      hover:shadow-2xl
      border
      border-gray-200
      transition-all
      duration-500
      hover:scale-[1.03]
      group-hover/cards:blur-[3px]
      hover:!blur-none
      hover:z-20
      relative
      overflow-hidden"
    >
      {/* Barre colorée */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

      <div className="flex gap-4 p-4">

        {/* Statistiques */}
        <div className="flex flex-col items-center justify-center gap-3 min-w-[75px]">

          <div className="text-center">
            <div className="font-bold text-xl text-gray-800">
              {question.votes || 0}
            </div>
            <div className="text-xs text-gray-500">
              Votes
            </div>
          </div>

          <div
            className={`text-center rounded-lg px-3 py-2 ${
              question.resolu
                ? "bg-green-500 text-white"
                : "bg-gray-100"
            }`}
          >
            <div className="font-bold">
              {question.nombreReponses || 0}
            </div>
            <div className="text-xs">
              Rép.
            </div>
          </div>

          <div className="text-center">
            <div className="font-bold text-gray-800">
              {question.vues || 0}
            </div>
            <div className="text-xs text-gray-500">
              Vues
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 flex flex-col">

          <h2
            className="
            text-lg
            font-bold
            text-gray-800
            group-hover:text-blue-600
            transition-colors
            line-clamp-2"
          >
            {question.titre}
          </h2>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {question.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags?.map((tag, i) => (
              <span
                key={i}
                className="
                rounded-full
                bg-blue-50
                px-3
                py-1
                text-xs
                font-medium
                text-blue-700
                border
                border-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center mt-5 text-xs text-gray-500">

            <div className="flex items-center gap-2">

              <div
                className={`
                w-9
                h-9
                rounded-full
                bg-gradient-to-r
                ${gradient}
                text-white
                flex
                items-center
                justify-center
                font-bold`}
              >
                {question.auteur?.prenom?.charAt(0)}
              </div>

              <div>
                <div className="font-semibold text-gray-700">
                  {question.auteur?.prenom} {question.auteur?.nom}
                </div>

                <div>
                  {new Date(question.createdAt).toLocaleDateString()}
                </div>
              </div>

            </div>

            {question.resolu && (
              <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">
                ✓ Résolu
              </span>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default QuestionCard;