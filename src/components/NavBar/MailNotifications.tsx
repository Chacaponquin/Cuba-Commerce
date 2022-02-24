import { Dispatch } from "react";
import { BsMailbox, BsX } from "react-icons/bs";
import { auth } from "../../firebase/client";

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
  const handleDeleteNotification = () => {
    console.log(auth.currentUser?.uid);
  };

  return (
    <section
      className={`navBar-mail-notifications ${
        notificationsOpen ? "notification-open" : "notification-close"
      }`}
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
                  <button onClick={() => handleOpenMessage(el.profileOwner.id)}>
                    Reply
                  </button>

                  <BsX size={25} onClick={handleDeleteNotification} />
                </section>
              </div>
            ))
          ) : (
            <h1>No tienes notificaciones</h1>
          )}
        </div>
      )}
    </section>
  );
};

export default MailNotifications;
