export interface Customer {
    id: number;
    firstname: string;
    lastname: string;
}

export interface Training {
    id: number;
    activity: string;
    date: string;
    duration: number;
    customer: string;
}