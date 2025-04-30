import { User } from "./user";

export class Notification {
    _id?: string;
    userId?: User | string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    read: boolean;
}