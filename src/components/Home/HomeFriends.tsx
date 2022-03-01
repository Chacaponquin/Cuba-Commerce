import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ProfileContext } from "../../context/ProfileContext";
import { db } from "../../firebase/client";

const HomeFriends = (): JSX.Element => {
  //EXTRAER STATE DE USER
  const { user } = useContext(ProfileContext);
  const [allFollowing, setAllFollowing] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      //CONSTRUIR LA QUERY DE LOS QUE SIGUE
      const queryFriends = query(
        collection(db, "users"),
        where("id", "==", user.uid)
      );

      getDocs(queryFriends)
        .then(async (querySnapshot) => {
          let allFollowing: any[] = [];
          querySnapshot.forEach((el) => {
            //OBTENER LOS ID DE LOS USUSARIOS A LOS QUE SIGUE
            allFollowing = el.data().following;
          });

          //POR CADA ID DE CADA USUARIO
          for (let i = 0; i < 10 && i < allFollowing.length; i++) {
            //BUSCAR INFORMACION DE ESE USSUARIO
            const personInf = await getDoc(doc(db, "users", allFollowing[i]));

            const data = personInf.data();
            if (data) {
              //CONSTRUIR EL OBJETO DEL USUARIO BUSCADO
              //EXTRAER ID, IMAGEN Y NOMBRE
              allFollowing[i] = {
                id: data.id,
                image: data.image,
                nickname: data.nickname,
              };
            }
          }

          setAllFollowing(allFollowing);
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  return (
    <div className="home-friends">
      {allFollowing.map((people, i: number) => (
        <Link key={i} to={`/profile/${people.id}`} className="profile-friend">
          {people.image ? (
            <img src={people.image} alt={people.nickname} />
          ) : (
            <section>
              <FaUser size={20} />
            </section>
          )}

          <p>{people.nickname}</p>
        </Link>
      ))}
    </div>
  );
};

export default HomeFriends;
