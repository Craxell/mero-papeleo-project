import axios from "axios";
import { BaseUrl } from "../../auth/BaseUrl";

export const generateAnswerRequest = async (question: string): Promise<string | null> => {
    try {
        const res = await axios.get(`${BaseUrl}/generate-answer`, {
            params: { query: question }, // Cambié 'query' a 'params'
        });

        console.log("Respuesta del servidor:", res.data); // Para verificar la respuesta

        if (res.status === 200 && res.data.answer) {
            return res.data.answer; // Accede a 'answer' desde 'data'
        } else {
            console.error("Unexpected response format", res);
            return null;
        }
    } catch (error) {
        console.error("Error fetching answer:", error);
        return null;
    }
};


export const uploadDocumentRequest = async (formData: FormData) => {
    try {
        const res = await axios.post(`${BaseUrl}/save-document`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error uploading document:", error);
        throw error;
    }
};

export const getDocumentRequest = async (documentId: string) => {
    try {
        const res = await axios.get(`${BaseUrl}/get-document`, {
            params: {
                document_id: documentId,
            },
        });
        if (res.status === 200 && res.data) {
            return res.data;
        } else {
            console.error("Unexpected response format", res);
            return null;
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        throw error;
    }
};

export const getVectorsRequest = async (): Promise<any[]> => {
    try {
        const res = await axios.get(`${BaseUrl}/get-vectors`);

        if (res.status === 201 && res.data) {
            return res.data;
        } else {
            console.error("Unexpected response format", res);
            return [];
        }
    } catch (error) {
        console.error("Error fetching vectors:", error);
        return [];
    }
};
