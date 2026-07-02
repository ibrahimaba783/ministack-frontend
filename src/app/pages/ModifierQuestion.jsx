import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const ModifierQuestion = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({ titre: '', description: '', tags: '' });

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.get(`https://ministack-backend-stpp.onrender.com/api/questions/${id}`);
                setFormData({
                    titre: res.data.titre,
                    description: res.data.description,
                    tags: res.data.tags?.join(', ') || ''
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchQuestion();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://ministack-backend-stpp.onrender.com/api/questions/${id}`, {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Question modifiée avec succès !');
            navigate('/profil');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Erreur');
        }
    };

    return (
        <div className="w-full px-4 md:px-10 py-6 md:py-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Modifier la question</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Titre</label>
                    <input
                        className="border py-2 px-3 border-black rounded"
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Description</label>
                    <textarea
                        className="border py-2 px-3 border-black rounded h-40"
                        name="description"
                        value={formData.description}
                        onChange={handleChange} />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Tags</label>
                    <input
                        className="border py-2 px-3 border-black rounded"
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange} />
                </div>

                <button
                    type="submit"
                    className="bg-purple-600 text-white py-2 px-6 rounded font-bold hover:bg-purple-700 w-fit">
                    Enregistrer les modifications
                </button>
            </form>
        </div>
    )
}

export default ModifierQuestion