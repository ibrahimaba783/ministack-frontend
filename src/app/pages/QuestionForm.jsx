import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const QuestionForm = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        tags: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           await axios.post('https://ministack-backend-stpp.onrender.com/api/questions', {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Question ajoutée avec succès !');
            navigate('/');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    return (
        <div className="w-full p-10">
            <h1 className="text-2xl font-bold mb-6">Poser une question</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Titre</label>
                    <input
                        className="border py-2 px-3 border-black rounded"
                        type="text"
                        name="titre"
                        placeholder="Titre de votre question"
                        onChange={handleChange} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Description</label>
                    <textarea
                        className="border py-2 px-3 border-black rounded h-40"
                        name="description"
                        placeholder="Décrivez votre question en détail"
                        onChange={handleChange} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Tags</label>
                    <input
                        className="border py-2 px-3 border-black rounded"
                        type="text"
                        name="tags"
                        placeholder="react, nodejs, mongodb (séparés par des virgules)"
                        onChange={handleChange} />
                </div>

                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-6 rounded font-bold hover:bg-green-600 w-fit">
                    Publier la question
                </button>
            </form>
        </div>
    )
}

export default QuestionForm