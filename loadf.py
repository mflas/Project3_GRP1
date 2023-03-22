import uuid
import sqlite3
import requests

# Make API call and get response
api_url = "https://data.bionet.nsw.gov.au/biosvcapp/odata/SpeciesSightings_CoreData?$select=class,basisOfRecord,sex,stateConservation,protectedInNSW,eventDate,decimalLatitude,decimalLongitude,family,county,scientificName,vernacularName&$filter=(startswith(eventDate,'2021') or startswith(eventDate,'2022') or startswith(eventDate,'2023')) and kingdom eq 'Animalia' and stateConservation ne 'Not Listed' and basisOfRecord eq 'HumanObservation' and class eq 'Mammalia'"
response = requests.get(api_url)
data = response.json()

# Create unique identifier for each record
for record in data["value"]:
    record['uuid'] = str(uuid.uuid4())

# Create SQLite database and table
conn = sqlite3.connect('instance/mydatabase.sqlite')
c = conn.cursor()
c.execute('''CREATE TABLE bionetNSW
             (animal_class text, basisOfRecord text, sex text, stateConservation text, protectedInNSW text, eventDate text, decimalLatitude text, decimalLongitude text, family text, county text, scientificName text, vernacularName text, uuid text)''')

columns = ['class','basisOfRecord','sex','stateConservation','protectedInNSW','eventDate','decimalLatitude','decimalLongitude','family','county','scientificName','vernacularName','uuid']

# Insert data into table
for record in data["value"]:
    keys= tuple(record[c] for c in columns)
    c.execute("INSERT INTO bionetNSW VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", keys)
    print(f'{record["uuid"]} data inserted Succefully')

# Commit changes and close connection
conn.commit()
conn.close()