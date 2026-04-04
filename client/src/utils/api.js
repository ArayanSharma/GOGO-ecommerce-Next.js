import Cookies from "js-cookie";

const appUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const postData = async (url, formData) => {
    try {
        console.log(`Sending POST request to: ${appUrl + url}`);
        
        const response = await fetch(appUrl + url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${Cookies.get("accessToken") || ""}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: true, message: data?.message || "Something went wrong" };
        }

        return data;

    } catch (error) {
        console.error('Fetch error:', error);
        return { 
            error: true, 
            message: "Failed to connect to server. Make sure the backend is running on " + appUrl 
        };
    }
};

export default postData;

export { postData };