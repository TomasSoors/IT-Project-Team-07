const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'localhost:8000';

const data = {
  // Ophalen van alle bomen
  async getTrees(mobile) {
    try {
      const url = mobile ? '10.0.2.2:8000' : `${baseUrl}`;
      const response = await fetch(`http://${url}/trees`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to fetch trees.');
      let tre = await response.json()      
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
        const baseUrl = process.env.REACT_APP_EXTERNAL_IP || 'localhost';
        
        const response = await fetch(`http://${baseUrl}:8000/trees`, {
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