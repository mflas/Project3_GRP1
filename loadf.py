import json
import sqlite3
connection = sqlite3.connect('bionetshort.sqlite')
cursor = connection.cursor()
cursor.execute('Create Table if not exists bionetNSW (class Text, basisOfRecord Text, sex Text, stateConservation Text, protectedInNSW Text, eventDate Date, decimalLatitude Integer, decimalLongitude Integer, family Text, county Text, scientificName Text, vernacularName Text)')
traffic = json.load(open('bionetshort.json'))
columns = ['class','basisOfRecord','sex','stateConservation','protectedInNSW','eventDate','decimalLatitude','decimalLongitude','family','county','scientificName','vernacularName']
rowcounter = 0
print (traffic.keys())
for row in traffic["value"]:
    keys= tuple(row[c] for c in columns)
    print(keys)
    cursor.execute('insert into bionetNSW values(?,?,?,?,?,?,?,?,?,?,?,?)',keys)
    print(f'{row["class"]} data inserted Succefully')
    rowcounter +=1
    if rowcounter ==75000:
        break
connection.commit()
connection.close()