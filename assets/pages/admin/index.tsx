import '@/index.css'
import {createRoot} from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import {AgentsPage} from "@/pages/admin/articles/agents-page.tsx";
import {ArticlesPage} from "@/pages/admin/articles-page";
import AminLayout from "@/pages/admin/layout/admin-layout";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from 'sonner';
import {AgentConfigPage} from "@/pages/admin/articles/agent-config-page.tsx";
import {AgentInstallPage} from "@/pages/admin/articles/agent-install-page.tsx";

const client = new QueryClient();
const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(
        <QueryClientProvider client={client}>
            <BrowserRouter>
                <Routes>
                    <Route path="admin" element={ <AminLayout /> }>
                        <Route path="agents">
                            <Route index element={<AgentsPage/>} />
                            <Route path=":agentId/settings" element={<AgentConfigPage/>} />
                            <Route path=":agentId/install" element={<AgentInstallPage/>} />
                        </Route>
                        <Route path="articles" element={<ArticlesPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
            <Toaster/>
        </QueryClientProvider>
    );
}
