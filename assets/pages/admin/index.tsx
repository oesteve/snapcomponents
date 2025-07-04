import '@/index.css'
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";
import {AgentsPage} from "@/pages/admin/agent/agents-page.tsx";
import {ArticlesPage} from "@/pages/admin/articles-page";
import AminLayout from "@/pages/admin/layout/admin-layout";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from 'sonner';
import {AgentConfigPage} from "@/pages/admin/agent/agent-config-page.tsx";
import {AgentInstallPage} from "@/pages/admin/agent/agent-install-page.tsx";
import {getAgent} from "@/lib/agents/agents.ts";
import {AgentLayout} from "@/components/admin/agents/settings-layout.tsx";

const client = new QueryClient();
const container = document.getElementById('root');

const router = createBrowserRouter([
    {
        path: "admin",
        element: <AminLayout />,
        children: [
            {
                path: "agents",
                children: [
                    {
                        index: true,
                        element: <AgentsPage />
                    },
                    {
                        path: ":agentId/settings",
                        element: <AgentLayout />,
                        children: [
                            {
                                path: "general",
                                loader: ({params}) => {
                                    const agentId = parseInt(params.agentId!);
                                    return getAgent(agentId);
                                },
                                element: <AgentConfigPage />
                            },
                            {
                                path: "install",
                                loader: ({params}) => {
                                    const agentId = parseInt(params.agentId!);
                                    return getAgent(agentId);
                                },
                                element: <AgentInstallPage />
                            }
                        ]
                    }
                ]
            },
            {
                path: "articles",
                element: <ArticlesPage />
            }
        ]
    }
]);

if (container) {
    const root = createRoot(container);
    root.render(
        <QueryClientProvider client={client}>
            <RouterProvider router={router} />
            <Toaster/>
        </QueryClientProvider>
    );
}
