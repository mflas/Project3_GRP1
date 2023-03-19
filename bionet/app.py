# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

# Setup FLask
app = Flask(__name__)

# Setup Database
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///mydatabase.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Link the SQLAlchemy app to a variable
db = SQLAlchemy(app)

#Create the model for the data
class Bionet(db.Model):
    __tablename__ = 'bionetNSW'

    uuid = db.Column(db.String(64), primary_key=True)
    animal_class = db.Column(db.String(64))
    basisOfRecord = db.Column(db.String(64))
    sex = db.Column(db.String(64))
    stateConservation = db.Column(db.String(64))
    protectedInNSW = db.Column(db.String(64))
    eventDate = db.Column(db.String(64))
    decimalLatitude = db.Column(db.Float)
    decimalLongitude = db.Column(db.Float)
    family = db.Column(db.String(64))
    county = db.Column(db.String(64))
    scientificName = db.Column(db.String(64))
    vernacularName = db.Column(db.String(64))

# Start the database
with app.app_context():
    db.create_all()

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/bionet")
def bionet():
    records = db.session.query(Bionet.uuid,Bionet.animal_class, Bionet.basisOfRecord,Bionet.sex,\
                                Bionet.stateConservation,Bionet.protectedInNSW ,Bionet.eventDate,\
                                Bionet.decimalLatitude,Bionet.decimalLongitude,Bionet.family,\
                                Bionet.county,Bionet.scientificName,Bionet.vernacularName).all()
    
    # records = db.session.query.all()
    records_list = []
    for record in records:
        record_dict = {
            "uuid": record.uuid,
            "animal_class": record.animal_class,
            "basisOfRecord": record.basisOfRecord,
            "sex": record.sex,
            "stateConservation": record.stateConservation,
            "protectedInNSW": record.protectedInNSW,
            # "eventDate": record.eventDate.strftime("%Y-%m-%d"),
            "decimalLatitude": record.decimalLatitude,
            "decimalLongitude": record.decimalLongitude,
            "family": record.family,
            "county": record.county,
            "scientificName": record.scientificName,
            "vernacularName": record.vernacularName,
        }
        records_list.append(record_dict)
    return jsonify(records_list)


if __name__ == "__main__":
    app.run(debug=True)