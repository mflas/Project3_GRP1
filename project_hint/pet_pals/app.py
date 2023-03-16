""" This is an example of a flask application called 'PetPals'
with both UI and API components
"""

# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
# 'or' allows us to later switch from 'sqlite' to an external database like 'postgres' easily
# os.environ is used to access 'environment variables' from the operating system
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///bionetdb.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from .models import Animal

#################################################
# Web User Interface - Front End
#################################################
# note that UI routes return a html response
# you can add as many html pages as you need
# below is an example to get you started...

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        # name = request.form["petName"]
        # lat = request.form["petLat"]
        # lon = request.form["petLon"]

        # class = request.form['class']
        basisOfRecord = request.form['basisOfRecord']
        sex = request.form['sex']
        stateConservation = request.form['stateConservation']
        protectedInNSW = request.form['protectedInNSW']
        eventDate = request.form['eventDate']
        decimalLatitude = request.form['decimalLatitude']
        decimalLongitude = request.form['decimalLongitude']
        family = request.form['family']
        county = request.form['county']
        scientificName = request.form['scientificName']
        vernacularName = request.form['vernacularName ']

        animal = bionetNSW(class=class, basisOfRecord = basisOfRecord , sex=sex,\
                           stateConservation=stateConservation,protectedInNSW=protectedInNSW ,\
                           eventDate=eventDate, decimalLatitude=decimalLatitude, decimalLongitude=decimalLongitude, family=family, county=county,\
                           scientificName=scientificName,vernacularName=vernacularName)
        bionetdb.session.add(Animal)
        bionetdb.session.commit()
        return redirect("/", code=302)

    return render_template("form.html")

#################################################
# API - Back End
#################################################
# we will use '/api/..' for our api within flask application
# note that api returns a JSON response
# you can add as many API routes as you need
# below is an example to get you started...

@app.route("/api/pals")
def pals():
    results = bionetdb.session.query(Animal.class, Animal.basisOfRecord,Animal.sex,\
                                     Animal.stateConservation,Animal.protectedInNSW ,Animal.eventDate,\
                                     Animal.decimalLatitude,Animal.decimalLongitude,Animal.family,\
                                     Animal.county,Animal.scientificName,Animal.vernacularName).all()

    hover_text = [result[0] for result in results]
    decimalLatitude = [result[1] for result in results]
    decimalLongitude = [result[2] for result in results]

    animal_data = [{
        "type": "scattergeo",
        "locationmode": "USA-states",
        "lat": decimalLatitude,
        "lon": decimalLongitude,
        "text": hover_text,
        "hoverinfo": "text",
        "marker": {
            "size": 15,
            "line": {
                "color": "rgb(8,8,8)",
                "width": 1
            },
        }
    }]

    return jsonify(animal_data)


if __name__ == "__main__":

    # initialise the database
    with app.app_context():
        bionetdb.create_all()

    # run the flask app
    app.run()
