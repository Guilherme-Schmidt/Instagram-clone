import { db } from "./firebase.js";
import { useEffect, useState } from "react";

function Post(props) {
  const [comentarios,setComentarios] = useState([]);

  useEffect(() => {
    db.collection('posts').doc(props.id).collection('comentarios').onSnapshot(function(snapshot){
      setComentarios(
        snapshot.docs.map(function (document) {
          return { id: document.id, info: document.data() };
        })
      );

    })
  }, []);

  function comentar(id, e) {
    e.preventDefault();
    let comentarioAtual = document.getElementById("comentario-" + id).value;
    alert(comentarioAtual);
    db.collection("posts").doc(id).collection("comentarios").add({
      nome: props.user,
      comentario: comentarioAtual,
    });
    alert("Comentando no post: " + id);

    document.getElementById("comentario-" + id).value = "";
  }

  return (
    <div className="postSingle">
      <img src={props.info.image}></img>
      <p>
        <b>{props.info.username}</b>: {props.info.titulo}
      </p>

      <div className="coments">

          {
            comentarios.map(function(val){
                return(
                  <div className="coments-single">
                    <p><b>{val.info.nome}</b> : {val.info.comentario }</p>
                  </div>
                )
            })
          }

      </div>
      <form onSubmit={(e) => comentar(props.id, e)}>
        <textarea id={"comentario-" + props.id}></textarea>
        <input type="submit" value="Comentar!"></input>
      </form>
    </div>
  );
}
export default Post;
