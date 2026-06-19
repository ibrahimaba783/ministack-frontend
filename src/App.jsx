import React from 'react'
import Connexion from './app/pages/Connexion';
import Inscription from './app/pages/Inscription';
import UserLayout from './app/layout/UserLayout';
import Accueil from './app/pages/Accueil';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profil from './app/pages/Profil';
import DetailQuestion from './app/pages/DetailQuestion';
import QuestionForm from './app/pages/QuestionForm';


const App = () => {

    const router = createBrowserRouter([

        {
            path: '/', element: <UserLayout />,
            children: [
                { path: '/', element: <Accueil /> },
                { path: '/connexion', element: <Connexion /> },
                { path: '/inscription', element: <Inscription /> },
                { path: '/profil', element: <Profil /> },
                { path: '/detail/:id', element: <DetailQuestion /> },
                //  route de creer question
                 {path:'/ajouter_question' , element:<QuestionForm/>},
            ]
        }

    ]);

    return (
        <RouterProvider router={router} />
    )
}

export default App