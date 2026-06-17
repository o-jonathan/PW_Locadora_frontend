//* CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//* Imports
import { createBrowserRouter, RouterProvider } from 'react-router';
//* Components
import MenuPublico from './components/MenuPublico';
import MenuPrivado from './components/MenuPrivado';
import Login from './components/tabs/login';
import Cadastro from './components/tabs/cadastro';
import Menu from './components/menu';
import Home from './components/tabs/home';
import Clientes from './components/tabs/clientes';
import Filmes from './components/tabs/filmes';
import Locacoes from './components/tabs/locacoes';
//* Contexts
import { ClientesProvider } from './components/context/clientesContext';
import { FilmesProvider } from './components/context/filmesContext';
import { LocacoesProvider } from './components/context/locacoesContext';
import MeuPerfil from './components/tabs/meuperfil';

const router = createBrowserRouter([
    {
        path: "/",
        element: <MenuPublico />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/cadastro",
                element: <Cadastro />
            }
        ]
    },
    {
        path: "/privado",
        element: <MenuPrivado />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "clientes",
                element: <Clientes />
            },
            {
                path: "filmes",
                element: <Filmes />
            },
            {
                path: "locacoes",
                element: <Locacoes />
            },
            {
                path: "meuperfil",
                element: <MeuPerfil />
            }
        ]
    }
]);

function App() {
    return (
        <ClientesProvider>
            <FilmesProvider>
                <LocacoesProvider>
                    <RouterProvider router={router} />
                </LocacoesProvider>
            </FilmesProvider>
        </ClientesProvider>
    );
}

export default App;