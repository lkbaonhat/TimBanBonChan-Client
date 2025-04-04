import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//* Routes

//* Layouts

//* Lazy load pages

const RouterComponent = () => {
  const router = createBrowserRouter([
    //* PUBLIC routes
    // {
    //   element: <PublicLayout />,
    //   children: [
    //     { index: true, path: config.routes.public.home, element: <Home /> },
    //     {
    //       path: config.routes.public.pricing,
    //       element: <PricingPage />,
    //     },
    //     {
    //       path: config.routes.auth.payment_method,
    //       element: <AddPaymentMethod />,
    //     },
    //     {
    //       path: config.routes.auth.checkout,
    //       element: <Checkout />,
    //     },
    //   ],
    // },
    //* AUTH routes *
    // ...AuthRoutes,
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
