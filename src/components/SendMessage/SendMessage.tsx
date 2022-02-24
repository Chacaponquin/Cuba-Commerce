import { Bars } from "@agney/react-loading";
import { Dispatch } from "react";
import { BsX } from "react-icons/bs";
import "./sendMessage.css";

interface SendMessageProps {
  handleSendMessage(id: string): any;
  setMessageOpen: Dispatch<boolean>;
  setMessage: Dispatch<string>;
  loading: boolean;
  profile: { name: string; id: string };
}

const SendMessageContainer = ({
  handleSendMessage,
  setMessageOpen,
  setMessage,
  loading,
  profile,
}: SendMessageProps): JSX.Element => {
  return (
    <div className="sendMessage-container">
      <section className="sendMessage-input">
        <h1>
          Para: {profile.name}
          <BsX size={40} onClick={() => setMessageOpen(false)} />
        </h1>
        <textarea
          required
          cols={70}
          rows={5}
          placeholder="Message..."
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div>
          {loading ? (
            <Bars />
          ) : (
            <button onClick={() => handleSendMessage(profile.id)}>Send</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default SendMessageContainer;
