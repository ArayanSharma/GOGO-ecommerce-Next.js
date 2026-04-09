import Cookies from "js-cookie";

const appUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Function to check if JWT token is valid
function isTokenValid(token) {
    if (!token) return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const payload = JSON.parse(atob(parts[1]));
        const expirationTime = payload.exp * 1000;
        return Date.now() < expirationTime;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

// Function to refresh access token
async function refreshAccessToken() {
    try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
            console.log('No refresh token available');
            return null;
        }

        const response = await fetch(appUrl + "/api/user/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            console.log('Token refresh failed');
            return null;
        }

        const data = await response.json();
        if (data.accessToken) {
            Cookies.set("accessToken", data.accessToken, { expires: 7 });
            return data.accessToken;
        }
        return null;
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
}

const postData = async (url, formData, retryCount = 0) => {
    try {
        let token = Cookies.get("accessToken");
        
        // Check and refresh token if needed
        if (token && !isTokenValid(token)) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                token = newToken;
            }
        }

        console.log(`Sending POST request to: ${appUrl + url}`);
        
        const response = await fetch(appUrl + url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${token || ""}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        // Handle 401 - attempt token refresh and retry once
        if (response.status === 401 && retryCount === 0) {
            console.log('Received 401, attempting token refresh...');
            const newToken = await refreshAccessToken();
            if (newToken) {
                console.log('Token refreshed, retrying request...');
                return postData(url, formData, 1); // Retry with new token
            }
        }

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
export { postData, isTokenValid, refreshAccessToken };