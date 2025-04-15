import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//* Routes
import AuthRoutes from './AuthRoutes';
import ROUTES from '@/constants/routes';
//* Layouts
import DefaultLayout from '@/layouts/DefaultLayout';
//* Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const CommunityPage = lazy(() => import('@/pages/Community'));

const RouterComponent = () => {
  const router = createBrowserRouter([
    //* PUBLIC routes
    {
      element: <DefaultLayout />,
      children: [
        { index: true, path: ROUTES.PUBLIC.HOME, element: <Home /> },
        { path: ROUTES.PUBLIC.COMMUNITY, element: <CommunityPage /> },
      ],
    },
    //* AUTH routes *
    ...AuthRoutes,
    //**** PRIVATE routes ****
    // {
    //   element: <PersistToken />,
    //   children: [
    //     //* Admin routes *
    //     {
    //       element: <PrivateRoute allowedRoles={[ROLE.ADMIN]} />,
    //       children: [AdminRoutes],
    //     },
    //     //* Member routes *
    //     {
    //       element: <PrivateRoute allowedRoles={[ROLE.MEMBER]} />,
    //       children: [...MemberRoutes],
    //     },
    //   ],
    // },
  ]);

  return <RouterProvider router={router} />;
};

export default RouterComponent;
