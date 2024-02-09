import { ChildProcess } from 'child_process';
import { Low } from 'lowdb/lib';
import { JSONFilePreset } from 'lowdb/node';

interface User {
    id: string;
    name: string;
};

export interface LatLng {
    lat: number;
    lng: number;
}
export interface Step {
    distance: {
        text: string;
        value: number;
    };
    duration: {
        text: string;
        value: number;
    };
    end_location: LatLng;
    start_location: LatLng;
    html_instructions: string;
    travel_mode: string;
    maneuver: string;
    polyline: {
        points: string;
    };
}

export interface DBGPS {
    origin: LatLng;
    destination: LatLng;
    destinationPlaceId: string;
    destinationName: string;
    distance: number;
    steps: Step[];
    currentLocation: LatLng;
    currentStepIndex: number;
    isConfirmed: boolean;
}


interface DBType {
    user: User | null;
    currentProcessId: number | null;
    gps: DBGPS | null;
}

export type DBPreset = Low<DBType>;

class DB {
    private db: DBPreset;

    constructor(db: DBPreset) {
        this.db = db;
    }

    public getUser(): User | null {
        return this.db.data.user;
    }

    public async setUser(user: User): Promise<void> {
        await this.db.update((data) => {
            data.user = user;
            return data;
        });

    }

    public getCurrentProcessId(): number | null {
        return this.db.data.currentProcessId;
    }

    public async setCurrentProcessId(processId: number | null): Promise<void> {
        await this.db.update((data) => {
            data.currentProcessId = processId;
            return data;
        });
    }

    public getGPS(): DBGPS | null {
        return this.db.data.gps;
    }

    public async setGPS(gps: DBGPS): Promise<void> {
        await this.db.update((data) => {
            data.gps = gps;
            return data;
        });
    }
}

const getDB = async () => {
    const db = await JSONFilePreset<DBType>('db.json', {
        user: null,
        currentProcessId: null,
        gps: null
    })

    return new DB(db);
}

export default getDB;







