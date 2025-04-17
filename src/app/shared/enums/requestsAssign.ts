import { RefList } from "../models/ref-list";
export enum RequestsAssign {
    assigned = "Assigned",
    unassigned = "Unassigned",
}
export const listRequestsAssign: RefList<RequestsAssign>[] = [
    { key: RequestsAssign.assigned, value: "Assigned" },
    { key: RequestsAssign.unassigned, value: "Unassigned" },
];