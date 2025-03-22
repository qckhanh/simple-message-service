import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faPaperPlane} from "@fortawesome/free-solid-svg-icons";

const Inputbox = ({message, setMessage, sendMessage, sendImage}) => {
    return (
        <div className="p-3 flex border-t">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 border-1 border-gray-300 rounded-xl p-2 font-semibold"
                placeholder="Type your message..."
            />
            <input
                type="file"
                accept="image/*"
                onChange={sendImage}
                className="hidden"
                id="imageUpload"
            />
            <label htmlFor={"imageUpload"} className={"ml-4 p-4 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600"}>
                <FontAwesomeIcon size={"xl"} icon={faImage} />
            </label>
            <button
                onClick={sendMessage}
                className="ml-4 p-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600"
            >
                <FontAwesomeIcon size={"xl"} icon={faPaperPlane} />
            </button>
        </div>
    );
}

export default Inputbox;