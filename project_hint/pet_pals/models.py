from .app import db


class Animal(bionetdb.Model):
    __tablename__ = 'bionetNSW'

    class = bionetdb.Column(bionetdb.text)
    basisOfRecord = bionetdb.Column(bionetdb.text)
    sex = bionetdb.Column(bionetdb.text)
    stateConservation = bionetdb.Column(bionetdb.text)
    protectedInNSW = bionetdb.Column(bionetdb.text)
    eventDate = bionetdb.Column(bionetdb.date)
    decimalLatitude = bionetdb.Column(bionetdb.integer)
    decimalLongitude = bionetdb.Column(bionetdb.integer)
    family = bionetdb.Column(bionetdb.text)
    county = bionetdb.Column(bionetdb.text)
    scientificName = bionetdb.Column(bionetdb.text)
    vernacularName = bionetdb.Column(bionetdb.text)


    def __repr__(self):
        return '<Animal %r>' % (self.name)




