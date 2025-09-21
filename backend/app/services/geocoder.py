from geopy.geocoders import Nominatim

class Geocoder:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="student_guidance_platform")

    def get_location(self, address):
        location = self.geolocator.geocode(address)
        if location:
            return {
                "latitude": location.latitude,
                "longitude": location.longitude,
                "address": location.address
            }
        return None

    def get_nearby_colleges(self, latitude, longitude, radius=10):
        # This method would ideally interact with a database or an API
        # to find nearby colleges based on latitude and longitude.
        # For now, it returns a placeholder response.
        return [
            {
                "name": "Government College of Arts",
                "distance": 2.5,
                "address": "123 College Rd, Jammu"
            },
            {
                "name": "Government Science College",
                "distance": 5.0,
                "address": "456 Science St, Jammu"
            }
        ]