export type Listing = {
  id: string;
  source: "adzuna" | "greenhouse" | "lever";
  source_id: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  description: string | null;
  apply_url: string;
  category: string | null;
  stipend: string | null;
  posted_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export const APPLICATION_STAGES: { id: ApplicationStatus; label: string }[] = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];

export type SavedApplication = {
  id: string;
  user_id: string;
  listing_id: string;
  status: ApplicationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  listing: Listing;
};
