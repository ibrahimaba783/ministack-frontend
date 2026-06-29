import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionCard from "./QuestionCard";

const Questions = () => {

  // liste des questions
  const [questions, setQuestions] = useState([]);
  const [recherche, setRecherche] = useState('');

  // charger les questions depuis l'API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("https://ministack-backend-stpp.onrender.com/api/questions");
        setQuestions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []); // se relance au chargement seulement

  // filtrer les questions selon la recherche (titre, description, tags)
  const questionsFiltrees = questions.filter((question) => {
    const texte = recherche.toLowerCase();
    return (
      question.titre?.toLowerCase().includes(texte) ||
      question.description?.toLowerCase().includes(texte) ||
      question.tags?.some((tag) => tag.toLowerCase().includes(texte))
    );
  });

  return (
    <div className="w-full p-10">
      <h1 className="text-3xl font-bold mb-6">Les questions</h1>

      {/* barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une question..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-purple-500" />

      {/* liste des questions */}
      <div className="space-y-4">
        {questionsFiltrees.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Aucune question pour le moment.</p>
        ) : (
          questionsFiltrees.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        )}
      </div>

    </div>
  );
};

export default Questions;