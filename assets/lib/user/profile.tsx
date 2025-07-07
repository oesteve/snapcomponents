import client from "@/lib/client.ts";

export type Profile = {
    name: string;
    email: string;
    picture: string;
    github: string;
    roles: string[];
};

export function getUser() {
    return client.get<Profile>("/api/user");
}
