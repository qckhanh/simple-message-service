import CommonRoom from "@/pages/CommonRoom/CommonRoom.jsx";
import DefaultLayout from "@/components/Layouts/DefaultLayout/DefaultLayout.jsx";

const publicRoutes = [
    { path:'/', component: CommonRoom, layout: DefaultLayout },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };