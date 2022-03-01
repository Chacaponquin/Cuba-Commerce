import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/client";

interface ProfileContextProps {
  user: any | null;
  notifications: any[];
}

export let ProfileContext = createContext<ProfileContextProps>({
  user: {},
  notifications: [],
});

const ProfileProvider = (props: any) => {
  const [user, setUser] = useState<any | null>();
  //STATE CON TODAS LAS NOTIFICACIONES DEL USUARIO
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    auth.onAuthStateChanged(
      (user) => {
        if (user) {
          setUser(user);

          //CONTRUIR LA QUERY DE EL USUARIO
          const queryNotification = doc(db, "users", user.uid);

          //SNAPSHOT DE LAS NOTIFICACIONES DEL PERFIL
          onSnapshot(
            queryNotification,
            async (querySnapshot) => {
              //EXTRAER LOS MENSAJES DEL USUARIO
              const messages = querySnapshot.data()?.messages;

              //BUSCAR EL CREADOR DE CADA MENSAJE
              for (let i = 0; i < messages.length; i++) {
                const profile = await getDoc(
                  doc(db, "users", messages[i].profileOwner)
                );

                //OBTENER EL NOMBRE Y EL ID DE CADA CREADOR
                messages[i].profileOwner = {
                  name: profile.data()?.nickname,
                  id: profile.data()?.id,
                };
              }

              //UBICARLOS EN EL STATE
              setNotifications(messages);
            },
            (error) => console.log(error)
          );
        }
      },
      (error) => setUser(null)
    );
  }, []);

  const data = { user, notifications };

  return (
    <ProfileContext.Provider value={data}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
