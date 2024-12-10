const baseUrl = process.env.REACT_APP_EXTERNAL_IP || "https://mutualism-backend-359585659782.europe-west1.run.app";

const login = {
  async login(username, password) {
    try {
      const formDetails = new URLSearchParams();
      formDetails.append('username', username);
      formDetails.append('password', password);

      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.access_token;
      } else {
        const errorData = await response.json();
        throw new Error("Failed to login.");
      }
    } catch (error) {
      console.error("Error in login:", error);
    }
  }
};

export default login;
