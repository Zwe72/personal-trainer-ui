export interface Customer {
    id: number;
    firstname: string;
    lastname: string;
    _links?: {
        self: {
            href: string;
        };
    };
}

export interface Training {
    id: number;
    activity: string;
    date: string;
    duration: number;

    customer: {
        firstname: string;
        lastname: string;
    };

    _links?: {
        self: { href: string; };
    };
}

export type NewTraining = {
  activity: string;
  date: string;
  duration: number;
  customer: string;
};

export type NewCustomer = Omit<Customer, "id" | "_links">;