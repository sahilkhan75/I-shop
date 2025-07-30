import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import SideMenu from '../components/SideMenu'

export default function AdminLayout() {
    return (
        <>
            <div className="w-full grid grid-cols-5">
                <div className="col-span-1">
                    <SideMenu />
                </div>
                <div className="col-span-4">
                    {/* <Header /> */}
                    <Header />
                    <Outlet />
                </div>
            </div>

        </>
    )
}


// import React from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { Outlet } from 'react-router-dom';
// import SideMenu from '../components/SideMenu';

// export default function AdminLayout() {
//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <SideMenu />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
//         <Header />
//         <main className="flex-grow p-4 bg-gray-100">
//           <Outlet />
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// }
