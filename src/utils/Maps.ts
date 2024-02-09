
import getDB, { DBGPS, Step, LatLng } from "./DB.js";
import { playSpeech, textToSpeech } from "./TextToSpeech";
import { convert } from "html-to-text";
interface PlacesAPIResponse {
    predictions: Prediction[];
    status: string;
}

interface Prediction {
    description: string;
    distance_meters: number;
    matched_substrings: Matchedsubstring[];
    place_id: string;
    reference: string;
    structured_formatting: Structuredformatting;
    terms: Term[];
    types: string[];
}

interface Term {
    offset: number;
    value: string;
}

interface Structuredformatting {
    main_text: string;
    main_text_matched_substrings: Matchedsubstring[];
    secondary_text: string;
}

interface Matchedsubstring {
    length: number;
    offset: number;
}

interface DirectionsAPIResponse {
    geocoded_waypoints: Geocodedwaypoint[];
    routes: Route[];
    status: string;
}

interface Route {
    copyrights: string;
    legs: Leg[];
    overview_polyline: Polyline;
    summary: string;
    warnings: any[];
    waypoint_order: any[];
}

interface Leg {
    distance: Distance;
    duration: Distance;
    end_address: string;
    end_location: LatLng;
    start_address: string;
    start_location: LatLng;
    steps: Step[];
    traffic_speed_entry: any[];
    via_waypoint: any[];
}



interface Polyline {
    points: string;
}

interface Distance {
    text: string;
    value: number;
}




interface Geocodedwaypoint {
    geocoder_status: string;
    place_id: string;
    types: string[];
}
export const getPlaceInfo = async (q: string) => {
    const gps = await (await getDB()).getGPS();
    if (!gps) return;
    // const gps = await (await getDB()).getGPS()?.currentLocation;
    const latLong = `${gps.currentLocation?.lat},${gps.currentLocation?.lng}`;
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&key=${process.env.GOOGLE_MAPS_API_KEY}&radius=20000&location=${latLong},&origin=${latLong}&region=in&components=country:in&limit=1`);
    const data = await response.json() as PlacesAPIResponse;
    const firstPlace = data.predictions[ 0 ];
    const directionsResp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${latLong}&destination=place_id:${firstPlace.place_id}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    const directionsData = await directionsResp.json() as DirectionsAPIResponse;
    const newGPS: DBGPS = {
        ...gps,
        destinationName: firstPlace.description,
        isConfirmed: true,
        destinationPlaceId: firstPlace.place_id,
        distance: directionsData.routes[ 0 ].legs[ 0 ].distance.value,
        steps: directionsData.routes[ 0 ].legs[ 0 ].steps,
        currentStepIndex: 0,
        destination: {
            lat: directionsData.routes[ 0 ].legs[ 0 ].end_location.lat,
            lng: directionsData.routes[ 0 ].legs[ 0 ].end_location.lng
        },
        origin: {
            lat: directionsData.routes[ 0 ].legs[ 0 ].start_location.lat,
            lng: directionsData.routes[ 0 ].legs[ 0 ].start_location.lng
        }
    }
    await (await getDB()).setGPS(newGPS);
    await textToSpeech(`Destination set to ${convert(firstPlace.description)}`);
    await playSpeech();
    await textToSpeech(gps.steps[ 0 ].html_instructions);
    await playSpeech();
}


