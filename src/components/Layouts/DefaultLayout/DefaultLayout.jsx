import Sidebar from "@/components/Layouts/Sidebar/Sidebar.jsx";

const DefaultLayout = ({children}) => {
    return (
        <div className="flex flex-row">
            <div className="w-1/6">
                <Sidebar />
            </div>
            <div className="w-5/6">
                {children}
            </div>
        </div>
    );
}

export default DefaultLayout;