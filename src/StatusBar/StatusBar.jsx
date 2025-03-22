import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleDot} from "@fortawesome/free-solid-svg-icons";

const StatusBar = ({socket, currentOnlineUser}) => {
    return (
        <div className={`${socket.connected ? "bg-green-700 " : " bg-red-700"} font-bold p-4 bg-green-600 text-white text-center flex flex-row gap-4 justify-center sticky top-0`}>
            <div>
                <FontAwesomeIcon size={"xl"} icon={faCircleDot} beatFade className={`rounded-full ${socket.connected ? "bg-green-700 " : " bg-red-700"}`} />
            </div>
            {socket.connected ? 'Online:  ' + currentOnlineUser : "Server is offline"}
        </div>
    );
}

export default StatusBar;