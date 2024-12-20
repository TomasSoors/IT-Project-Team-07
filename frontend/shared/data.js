const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'http://localhost:8000';

const data = {
  // Ophalen van alle bomen
  async getTrees() {
    try {
      const url = 'https://mutualism-backend-359585659782.europe-west1.run.app/';
      const response = await fetch(`${url}/trees`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to fetch trees.');     
      return await response.json();
    } catch (error) {
      console.error('Error fetching trees:', error);
      return [];
    }
  },

  // Toevoegen van bomen via bestand
  async addTree(tree) {
    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${baseUrl}/trees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: tree.name,
            description: tree.description,
            latitude: tree.latitude,
            longitude: tree.longitude,
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error adding tree:", errorData);
          throw new Error("Failed to add tree.");
        }
    
        console.log("Tree added successfully.");
      } catch (error) {
        console.error("Error in addTree:", error);
      }
  },
};

export default data;