import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
    beforeLoad: () => ({
        title: undefined,
    }),
    component: Index,
});

function Index() {
    return (
        <div className="p-2">
            <h3>Welcome Admin home!</h3>
        </div>
    );
}
