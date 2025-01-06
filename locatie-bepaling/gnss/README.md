# Guide om gnss systeem op te zetten en uit te lezen
om het gnss systeem uit te lezen hebben we gebruik gemaakt van een bestaand project van PXL. Dit is de github-pagina: https://github.com/PXLRoboticsLab/AMOROSO_UnitreeGo1CompanionComputer. We hebben een kleine aanpassing gemaakt aan het script dat de locatie opvraagt van het gnss systeem. Hierdoor krijgen we zowel Latitude, Longitude als Heading van het gnss systeem. Best doe je volgende stappen in een **Linux** omgeving, aangezien er .sh scripts gebruikt worden om alles op te zetten.

### 1. Repo clonen
```
git clone https://github.com/PXLRoboticsLab/AMOROSO_UnitreeGo1CompanionComputer.git
```

### 2. Docker containers builden en runnen
Nadat de repo gecloned is, open je een nieuwe terminal in de hoofdfolder van AMOROSO_UnitreeGo1CompanionComputer. Ga dan naar de directory 01_pxl_noetic_go1_companion.
```
cd 01_pxl_noetic_go1_companion
```
Build de image.
```
./01_build_image.sh
```
Run container.
```
./02_run_container.sh
```

### 3.Copy het aangepaste script naar de container
Open een nieuwe terminal in de hoofdmap van onze repo: IT-Project-Team-07. Nu kan je het script copyen in de container die we net hebben aangezet.
```
docker cp ./locatie-bepaling/gnss/gps_publisher.py pxl_noetic_go1_companion:/home/user/Projects/catkin_ws/src/navigation/src/gps_publisher.py
```

### 4. Altus nr3 aanzetten
Zet de altus nr3 aan door op de power button te duwen. Om af te zetten hou je de power button even in. Verbind je laptop met de altus nr3 door deze bij de wifi te selecteren. Zet ook de bluetooth aan van je laptop.

### 5. Roscore runnen
Attach met de docker container die bij stap 2 is opgezet.
```
docker exec -it pxl_noetic_go1_companion bash
```

Start roscore op. In de container voer je volgende commando's uit.
```
source /opt/ros/noetic/setup.bash
```
```
source /home/user/Projects/catkin_ws/devel/setup.bash
```
```
roscore
```

### 6. Script runnen
Open een nieuwe terminal en attach terug met de docker container.
```
docker exec -it pxl_noetic_go1_companion bash
```

Run het script met volgend commando.
```
rosrun navigation gps_publisher.py
```

Je bent nu klaar om metingen te doen!

Na afloop doe je een ctrl + c in de laatste terminal waar het script runde.

### 7. Dashboard altus nr3 bekijken
Je kan op het dashboard van de altus nr3 nog handige info terugvinden. Zoals hoeveel satelieten er verbonden zijn, de connectie met bluetooth, batterij percentages, etc. Om het dashboard te zien surf je naar **http://192.168.20.1/**.

### 8. Coördinaten afhalen
Open een nieuwe terminal en voer volgend commando uit. Je kan de log file dan terugvinden in je ~/Desktop folder.
```
docker cp pxl_noetic_go1_companion:/home/user/logs/gps_publisher.log ~/Desktop/gps_publisher.log
```

