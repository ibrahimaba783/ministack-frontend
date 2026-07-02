import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionCard from "./QuestionCard";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState("recent");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://ministack-backend-stpp.onrender.com/api/questions"
        );
        setQuestions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []);

  const questionsFiltrees = questions.filter((question) => {
    const texte = recherche.toLowerCase();
    return (
      question.titre?.toLowerCase().includes(texte) ||
      question.description?.toLowerCase().includes(texte) ||
      question.tags?.some((tag) => tag.toLowerCase().includes(texte))
    );
  });

  const questionsTriees = [...questionsFiltrees].sort((a, b) => {
    if (tri === "votes") return (b.votes || 0) - (a.votes || 0);
    if (tri === "nonResolus")
      return (a.nombreReponses || 0) - (b.nombreReponses || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="cards flex flex-col gap-4">

      {/* Titre + tri */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          Les questions
        </h1>

        <select
          value={tri}
          onChange={(e) => setTri(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 w-full sm:w-auto"
        >
          <option value="recent">Plus récent</option>
          <option value="votes">Plus votés</option>
          <option value="nonResolus">Non résolus</option>
        </select>
      </div>

      {/* Barre de recherche style Uiverse */}
      <div className="relative mb-6 group">

        {/* Halo */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-purple-600 opacity-30 blur-xl group-hover:opacity-60 transition duration-500"></div>

        {/* Bordure */}
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-500">

          {/* Fond */}
          <div className="relative flex items-center bg-[#0a0a0f] rounded-2xl overflow-hidden">

            {/* Icône */}
            <div className="absolute left-4 text-gray-400 text-xl">
              🔍
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="
                w-full
                bg-transparent
                text-white
                placeholder:text-gray-500
                py-4
                pl-14
                pr-16
                outline-none
              "
            />


          </div>

        </div>

      </div>

      {/* Liste */}
      <div className="space-y-4">
        {questionsTriees.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            Aucune question pour le moment.
          </p>
        ) : (
          questionsTriees.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Questions;