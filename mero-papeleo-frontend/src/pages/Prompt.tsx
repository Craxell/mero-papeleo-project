import { Form, Image, Button } from "react-bootstrap";
import "../assets/css/Prompt.css";
import upload from "../assets/images/upload.png";
import { generateAnswerRequest, uploadDocumentRequest } from "../assets/ts/functions_Prompt";
import { useState } from "react";

const Prompt: React.FC = () => {
  interface Response {
    question: string;
    answer: string; // Cambié `any` a `string` para mayor claridad
  }

  const [responses, setResponses] = useState<Response[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Función para manejar la carga de archivos
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError("Por favor, selecciona un archivo para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setError(null);
 
    try {
      await uploadDocumentRequest(formData);
      setSelectedFile(null);
    } catch (err) {
      setError("Error al subir el archivo. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question) {
      setError("Por favor, ingresa una pregunta.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const answer = await generateAnswerRequest(question);
      if (answer) {
        setResponses((prevResponses) => [...prevResponses, { question, answer }]);
        setQuestion(""); // Limpiar el campo de entrada
      } else {
        setError("No se pudo generar la respuesta.");
      }
    } catch (error) {
      setError("Error al generar respuesta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 p-2">
            <div className="prompt-custom">
              <div className="chat-prompt">
                <h1 className="prompt-title-custom">Prompt</h1>
                <hr className="my-4 split-prompt" />
                <p className="contenido-prompt">
                  Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </p>
                <hr className="my-4 split-prompt" />

                <div className="div-prompt">
                  <Form.Control
                    className="input-prompt"
                    type="text"
                    placeholder="Inserta tu Prompt"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Button
                    className="btn-prompt"
                    onClick={handleAskQuestion}
                    disabled={loading}
                  >
                    {loading ? "Generando..." : "Enviar"}
                  </Button>

                  {/* Selector de archivo */}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <Button
                    className="button-file"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Image className="imageUpload" src={upload} />
                  </Button>

                  {selectedFile && (
                    <>
                      <p>Archivo seleccionado: {selectedFile.name}</p>
                      <Button className="btn-upload" onClick={handleFileUpload} disabled={loading}>
                        {loading ? "Subiendo..." : "Subir archivo"}
                      </Button>
                    </>
                  )}
                  {error && <p className="error-message">{error}</p>}
                </div>

                {/* Listado de preguntas y respuestas */}
                <div className="response-list">
                  {responses.map((response, index) => (
                    <div key={index} className="response-item">
                      <strong>Pregunta:</strong> {response.question} <br />
                      <strong>Respuesta:</strong> {response.answer} {/* Asegúrate de que esto es lo que quieres mostrar */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
