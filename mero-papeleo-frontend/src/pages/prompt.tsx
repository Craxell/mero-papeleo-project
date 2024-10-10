import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { generateAnswerRequest } from "../assets/ts/functions_Prompt";




const Prompt: React.FC = () => {

  interface Response {
    question: string;
    answer: any;
  }
  
  const [responses, setResponses] = useState<Response[]>([]);
  
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleAskQuestion = async () => {
    if (question.trim() === "") return;

    setLoading(true);
    setError(null);

    try {
        const res = await generateAnswerRequest(question);

        if (res) {
            setResponses([...responses, { question, answer: res }]);
        } else {
            setError("Error generating response. Please try again.");
        }

        setQuestion(""); // Limpiar el campo de pregunta
    } catch (err) {
        setError("Error generating response. Please try again.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 p-2">
            <div className="jumbotron rounded-0">
              <h1 className="display-4">Prompt</h1>
              <p className="lead">Página de prompt interactivo.</p>
              <hr className="my-4" />
              <p>
                Este chat te permite hacer preguntas y recibir respuestas generadas desde el backend. 
                Escribe una pregunta y recibe la respuesta.
              </p>
              {/* Sección de chat */}
              <div className="mt-3 p-3 border rounded bg-light" style={{ height: '400px', overflowY: 'auto' }}>
                {responses.map((response, index) => (
                  <div key={index} className="mb-3">
                    <div><strong>Tú:</strong> {response.question}</div>
                    <div><strong>ChatBot:</strong> {response.answer}</div>
                  </div>
                ))}
              </div>
              <br />
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe tu pregunta..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div className="input-group-append">
                  <Button variant="primary" onClick={handleAskQuestion} disabled={loading}>
                    {loading ? "Preguntando..." : "Preguntar"}
                  </Button>
                </div>
              </div>
              {error && <p className="text-danger">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
