import {BlurFade} from "@/components/magicui/blur-fade.js";

const MessageContainer = ({chatContainerRef,messages, isSender, username }) => {
    return (
        <div ref={chatContainerRef} className="mt-0 bg-gray-900 flex-1 overflow-auto p-4 space-y-2 flex-grow overflow-y-auto">
            {messages.map((msg, index) => {
                const isSelf = msg.username === username;
                const isContinuous = index > 0 && messages[index - 1].username === msg.username;

                return (
                    <div key={index} className={` flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div>
                            {!isContinuous && (
                                <div className={`text-gray-600 text-sx ${isSelf ? 'text-right pr-2' : 'text-left pl-2'}`}>
                                    {isSelf ? "Me" : msg.username}
                                </div>)}
                            {/*max-w-xs mb-2 py-2 px-3 bg-gray-200 rounded-xl rounded-bl-none*/}
                            {/*p-3 rounded-full max-w-fit ${isSelf ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}*/}
                            {msg.type === "text" ? (
                                <div className={`inline-block max-w-md mb-2 py-2 px-3 rounded-2xl ${isSelf ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'}`}>
                                    <BlurFade delay={0.2} inView={false}>
                                        <div className={"font-semibold"}>
                                            {msg.message}
                                        </div>
                                    </BlurFade >
                                </div>
                            ) : (
                                <div className={`flex ${isSender ? ' flex-row' : 'flex-row-reverse'} gap-3 items-center`}>
                                    {/*<FontAwesomeIcon className={"text-blue-700"} icon={faCircleArrowDown} size="xl" />*/}
                                    <div className={`inline-flex w-auto mb-2 py-3 px-3 rounded-2xl ${isSelf ? 'bg-gray-200 text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'}`}>
                                        <img alt={"error"} className={"rounded-lg m-1 w-xs"} src={msg.message} />

                                        {/*<BlurFade delay={0.3} inView={false}>*/}
                                        {/*        <img alt={"error"} className={"rounded-lg m-1 w-xs"} src={msg.message} />*/}
                                        {/*</BlurFade >*/}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                );
            })}
        </div>
    );

}

export default MessageContainer;