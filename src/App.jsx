
import {Route, Routes} from "react-router";
import {publicRoutes} from "@/routes/routes.js";

function App() {
   return (
      <Routes>
         {
            publicRoutes.map((route, index) => {
                const Page = route.component;
                const CurrentLayout = route.layout;
                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={<CurrentLayout>{<Page />}</CurrentLayout>}
                    />
                )
            })
         }
      </Routes>
   );
}

export default App;
