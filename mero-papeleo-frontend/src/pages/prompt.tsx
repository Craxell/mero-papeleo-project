import React, { useState } from 'react';
import { generateAnswerRequest } from '../assets/ts/functions_Prompt';

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
    <><div className="content">

      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 p-2">
            <div className="jumbotron rounded-0">
              <h1 className="display-4">Prompt</h1>
              <p className="lead">Pagina de prompt.</p>
              <hr className="my-4" />
              <p>Un texto de ejemplo: Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, voluptatem ea similique ratione vero mollitia accusantium! Eius amet minus dolorum sint odio ut ipsam temporibus necessitatibus blanditiis quidem, iusto doloremque!</p>
              <a href="#" className="btn btn-primary btn-lg rounded-0">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
};

export default Prompt;
