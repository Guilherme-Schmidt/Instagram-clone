import { useEffect, useState } from "react";
import { auth, storage, db } from "./firebase.js";
import firebase from "firebase";

function Header(props) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {}, []);

  function criarContaModal(e) {
    e.preventDefault();

    let modal = document.querySelector(".modalCriarConta");

    modal.style.display = "block";
  }

  function fecharModal() {
    let modal = document.querySelector(".modalCriarConta");

    modal.style.display = "none";
  }

  function criarConta(e) {
    e.preventDefault();

    let email = document.getElementById("email-cadastro").value;
    let user = document.getElementById("user-cadastro").value;
    let senha = document.getElementById("senha-cadastro").value;

    //Criar conta no Firebase

    auth
      .createUserWithEmailAndPassword(email, senha)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: user,
        });
        alert("conta criada com sucesso");
        fecharModal();
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function logar(e) {
    e.preventDefault();
    let email = document.getElementById("email-login").value;
    let senha = document.getElementById("senha-login").value;

    auth
      .signInWithEmailAndPassword(email, senha)
      .then((auth) => {
        props.setUser(auth.user.displayName);
        alert("Logado com sucesso");
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function abrirModalUpload(e) {
    e.preventDefault();

    let modal = document.querySelector(".modalUpload");

    modal.style.display = "block";
  }

  function fecharModalUpload(e) {
    let modal = document.querySelector(".modalUpload");

    modal.style.display = "none";
  }

  function uploadPost(e) {
    e.preventDefault();

    let tituloPost = document.getElementById("titulo-upload").value;

    const uploadTask = storage.ref(`images/${file.name}`).put(file);

    uploadTask.on(
      "state_changed",
      function (snapshot) {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      function (error) {},
      function () {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then(function (url) {
            db.collection("posts").add({
              titulo: tituloPost,
              image: url,
              username: props.user,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setProgress(0);
            setFile(null);

            alert("Upload Realizado com Sucesso!!");

            document.getElementById("form-upload").reset();
          });
      }
    );
  }

  function deslogar(e) {
    e.preventDefault();
    auth.signOut().then(function (val) {
      props.setUser(null);
    });
  }

  return (
    <div className="header">
      <div className="modalCriarConta">
        <div className="formCriarConta">
          <div onClick={() => fecharModal()} className="close-modal-criar">
            X
          </div>
          <h2>Criar Conta</h2>
          <form onSubmit={(e) => criarConta(e)}>
            <input
              id="email-cadastro"
              type="text"
              placeholder="Seu Email"
            ></input>
            <input
              id="user-cadastro"
              type="text"
              placeholder="Seu nome de usuario"
            ></input>
            <input
              id="senha-cadastro"
              type="password"
              placeholder="Sua Senha"
            ></input>
            <input type="submit" value="Criar Conta"></input>
          </form>
        </div>
      </div>

      <div className="modalUpload">
        <div className="formUpload">
          <div
            onClick={() => fecharModalUpload()}
            className="close-modal-criar"
          >
            X
          </div>
          <h2>Fazer upload</h2>
          <form id="form-upload" onSubmit={(e) => uploadPost(e)}>
            <progress id="progressUpload" value={progress}></progress>
            <input
              id="titulo-upload"
              type="text"
              placeholder="Nome da sua foto..."
            ></input>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              name="file"
            ></input>
            <input type="submit" value="Postar!"></input>
          </form>
        </div>
      </div>

      <div className="center">
        <div className="header__logo">
          <a href="">
            <img src="https://bluebus-wp.s3.amazonaws.com/wp-content/uploads/2013/05/instagram-logo-old.jpg"></img>
          </a>
        </div>

        {props.user ? (
          <div className="header__logadoInfo">
            <span>
              Olá <b>{props.user}</b>
            </span>
            <a onClick={(e) => abrirModalUpload(e)} href="#">
              Postar!
            </a>
            <a onClick={(e) => deslogar(e)}>Deslogar!</a>
          </div>
        ) : (
          <div className="header__loginForm">
            <form onSubmit={(e) => logar(e)}>
              <input
                id="email-login"
                type="text"
                placeholder="Login..."
              ></input>
              <input
                id="senha-login"
                type="password"
                placeholder="Senha"
              ></input>
              <input type="submit" value="Logar" name="acao"></input>
            </form>
            <div className="btn__criarConta">
              <a onClick={(e) => criarContaModal(e)} href="#">
                Criar Conta!
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
