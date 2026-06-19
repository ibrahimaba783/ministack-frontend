import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionCard from "./QuestionCard";

const Questions = () => {

  // liste des questions
  const [questions, setQuestions] = useState([]);
  
  // charger les questions depuis l'API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/questions");
        setQuestions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []); // se relance au chargement seulement

  return (
    <div className="w-full p-10">
      <h1 className="text-3xl font-bold mb-6">Les questions</h1>

      {/* liste des questions */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Aucune question pour le moment.</p>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        )}
      </div>

    </div>
  );
};

export default Questions;