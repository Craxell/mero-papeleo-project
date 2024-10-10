import axios from "axios";
import { BaseUrl } from "../../auth/BaseUrl";

export const generateAnswerRequest = async (question: string): Promise<string | null> => {
    try {
        const res = await axios.get(`${BaseUrl}/generate-answer`, {
            params: {
                query: question,
            },
        });

        if (res.status === 200 && res.data) {
            return res.data.answer; // Asegúrate de que `res.data.answer` sea el campo correcto
        } else {
            console.error("Unexpected response format", res);
            return null;
        }
    } catch (error) {
        console.error("Error fetching answer:", error);
        return null;
    }
};
