import { RefList } from "../models/ref-list";

export enum ComplaintsStatus {
 
    submitted = "Submitted",
    HandledByTech = "Handled By Tech",
    InProgress = "In Progress",
    Resolved = "Resolved",
    Paused = "Paused",
    underReview = "Under Review",
}

export const listComplaintsStatus: RefList<ComplaintsStatus>[] = [

    { key: ComplaintsStatus.submitted, value: "Submitted" },
    { key: ComplaintsStatus.HandledByTech, value: "Handled By Tech" },
    { key: ComplaintsStatus.InProgress, value: "In Progress" },
    { key: ComplaintsStatus.Resolved, value: "Resolved" },
    { key: ComplaintsStatus.Paused, value: "Paused" },
    { key: ComplaintsStatus.underReview, value: "Under Review" },
];