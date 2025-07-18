import client from "@/lib/client.ts";

export type User = {
    id: number;
    name: string;
    email: string;
    picture: string;
    github: string;
    roles: string[];
};

export function getUser() {
    return client.get<User>("/api/user");
}
