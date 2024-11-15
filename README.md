# IT-Project Team-07: MUTUALISM

![PXL Digital Logo](https://www.pxl.be/Assets/website/pxl_algemeen/afbeeldingen/grotere_versie/logo_pxl_digital.png)

## Teamleden
- **Maarten Gregoor**
- **Bram Verbeiren**
- **Yoran Byloos**
- **Tomas Soors**
- **Jesse Houben**
- **Yarne Camps**
- **Robby Willems**

## Beschrijving
Dit project is gericht op het ontwikkelen van een mobiele applicatie voor stedelijk boomonderhoud. De app zal steden en gemeenten helpen bij het beheren van boominventarissen, het monitoren van hun gezondheid en het efficiënt plannen van onderhoud. Door gebruik te maken van geavanceerde sensortechnologieën zoals LIDAR en AI, zal de app realtime gegevens verzamelen om zorg voor bomen en duurzaamheid te waarborgen.

## Projectdoel
- Ontwikkel een mobiele app die integreert met LIDAR-sensoren voor het verzamelen van boomgegevens.
- Visualiseer de gegevens in een gebruiksvriendelijke interface voor eenvoudigere besluitvorming.
- Bied statistieken over boomgezondheid, onderhoudsschema's en milieubevorderende voordelen.


## Opstartinstructies

### **Frontend**

#### **Web**
1. **Vereisten**:
   - Zorg ervoor dat **Node.js** geïnstalleerd is.

2. **Installatie en opstarten**:
   - Navigeer naar de map `frontend/web`.
   - Voer het volgende commando uit om de vereiste pakketten te installeren:
     ```bash
     npm install
     ```
   - Start de webapplicatie:
     ```bash
     npm start
     ```

#### **Mobile**
1. **Vereisten**:
   - Zorg ervoor dat **Node.js** geïnstalleerd is.
   - Installeer **Android Studio** en configureer een virtueel Android-apparaat (AVD).

2. **Installatie en opstarten**:
   - Navigeer naar de map `frontend/mobile`.
   - Voer het volgende commando uit om de vereiste pakketten te installeren:
     ```bash
     npm install
     ```
   - Start de mobiele applicatie:
     ```bash
     npm start
     ```
   - Zorg ervoor dat Android Studio actief is en een Android Virtual Device (AVD) draait.

---

### **Backend**

1. **Vereisten**:
   - Zorg ervoor dat **Python** en **pip** geïnstalleerd zijn.
   - Installeer een MySQL-server en configureer deze volgens onderstaande stappen.

2. **Databaseconfiguratie**:
   - Open een MySQL-shell en voer de volgende commando's uit:
     ```sql
     CREATE DATABASE userdatabase;
     CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
     GRANT ALL PRIVILEGES ON userdatabase.* TO 'user'@'localhost';
     FLUSH PRIVILEGES;
     ```

3. **Installatie en opstarten**:
   - Navigeer naar de backend-map.
   - Installeer de vereiste Python-pakketten:
     ```bash
     pip install -r requirements.txt
     ```
   - Start de backend-server:
     ```bash
     uvicorn main:app
     ```

4. **API Documentatie**:
   - Ga naar [https://localhost:8000/docs](https://localhost:8000/docs) om de Swagger UI te bekijken en de API te testen.


## Volgende Stappen
Voorlopig richten we ons op planning en onderzoek. De codering begint binnenkort zodra alle vereisten zijn gedefinieerd.
