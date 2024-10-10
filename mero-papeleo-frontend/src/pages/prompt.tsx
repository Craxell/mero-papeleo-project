import { Form, Image } from "react-bootstrap";
import React from "react";
import "../assets/css/Prompt.css";
import upload from "../assets/images/upload.png";

const Prompt: React.FC = () => {
  return (
    <>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-2">
              <div className="prompt-custom">
                <div className="chat-prompt">
                  <h1 className="prompt-title-custom">Prompt</h1>
                  <hr className="my-4 split-prompt" />
                  <p className="contenido-prompt">
                    Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Delectus, voluptatem ea similique ratione
                    vero mollitia accusantium! Eius amet minus dolorum sint odio
                    ut ipsam temporibus necessitatibus blanditiis quidem, iusto
                    doloremque!
                    Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Delectus, voluptatem ea similique ratione
                    vero mollitia accusantium! Eius amet minus dolorum sint odio
                    ut ipsam temporibus necessitatibus blanditiis quidem, iusto
                    doloremque!
                    Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Delectus, voluptatem ea similique ratione
                    vero mollitia accusantium! Eius amet minus dolorum sint odio
                    ut ipsam temporibus necessitatibus blanditiis quidem, iusto
                    doloremque!
                    Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Delectus, voluptatem ea similique ratione
                    vero mollitia accusantium! Eius amet minus dolorum sint odio
                    ut ipsam temporibus necessitatibus blanditiis quidem, iusto
                    doloremque!
                    Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Delectus, voluptatem ea similique ratione
                    vero mollitia accusantium! Eius amet minus dolorum sint odio
                    ut ipsam temporibus necessitatibus blanditiis quidem, iusto
                    doloremque!
                  </p>
                  <hr className="my-4 split-prompt" />
                </div>
                <div className="div-prompt">
                  <Form.Control
                    className="input-prompt"
                    type="text"
                    placeholder="Inserta tu Prompt"
                  />
                  <button className="button-file">
                    <Image className="imageUpload" src={upload} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prompt;
