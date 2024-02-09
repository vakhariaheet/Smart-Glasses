import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
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

export type DBPreset = low.LowdbSync<DBType>;

class DB {
    private db: DBPreset;

    constructor(db: DBPreset) {
        this.db = db;
    }

    public getUser(): User | null {
        return this.db.get('user').value();
    }

    public async setUser(user: User): Promise<void> {
        await this.db.set('user', user).write();

    }

    public getCurrentProcessId(): number | null {
        return this.db.get('currentProcessId').value();
    }

    public async setCurrentProcessId(processId: number | null): Promise<void> {
        await this.db.set('currentProcessId', processId).write();
    }

    public getGPS(): DBGPS | null {
        return this.db.get('gps').value();
    }

    public async setGPS(gps: DBGPS): Promise<void> {
        await this.db.set('gps', gps).write();
    }
}

const getDB = async () => {
    const db = await low(new FileSync<DBType>('db.json'));

    return new DB(db);
}

export default getDB;







