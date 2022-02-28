import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { Dispatch } from "react";
import { BsMailbox, BsX } from "react-icons/bs";
import { auth, db } from "../../firebase/client";

interface MailNotificationsProps {
  notifications: any[];
  handleOpenMessage(id: string): any;
  notificationsOpen: boolean;
  setNotificationsOpen: Dispatch<boolean>;
}

const MailNotifications = ({
  notifications,
  handleOpenMessage,
  notificationsOpen,
  setNotificationsOpen,
}: MailNotificationsProps): JSX.Element => {
  //FUNCION PARA ELIMINAR UNA NOTIFICACION
  const handleDeleteNotification = (message: any) => {
    if (auth.currentUser) {
      updateDoc(doc(db, "users", auth.currentUser.uid), {
        messages: arrayRemove(message),
      })
        .then(() => {})
        .catch((error) => console.log(error));
    }
  };

  return (
    <span
      className={`navBar-mail-notifications ${
        notificationsOpen ? "notification-open" : "notification-close"
      }`}
      title={String(notifications.length)}
    >
      <BsMailbox
        size={40}
        onClick={() => setNotificationsOpen(!notificationsOpen)}
      />

      {notificationsOpen && (
        <div className="mail-notifications">
          {notifications.length ? (
            notifications.map((el, i: number) => (
              <div key={i}>
                <p>{el.messageNotification}</p>

                <section>
                  <button onClick={() => handleOpenMessage(el.id)}>
                    Reply
                  </button>

                  <BsX size={25} onClick={() => handleDeleteNotification(el)} />
                </section>
              </div>
            ))
          ) : (
            <h1>No tienes notificaciones</h1>
          )}
        </div>
      )}
    </span>
  );
};

export default MailNotifications;
