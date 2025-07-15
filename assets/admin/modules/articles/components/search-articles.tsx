import { useMutation } from "@tanstack/react-query";

import { useCurrentAgent } from "@/admin/modules/agents/hooks/current-agent.tsx";
import { Button } from "@/components/ui/button.tsx";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import {
    type Article,
    searchArticles,
} from "@/admin/modules/articles/lib/articles.ts";

interface SearchToolbarProps {
    onResults: (results: Article[]) => void;
    onReset: () => void;
}

export function SearchArticles({ onResults, onReset }: SearchToolbarProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState<string>();

    const agent = useCurrentAgent();

    const searchMutation = useMutation({
        mutationFn: searchArticles,
        onSuccess: (data) => onResults(data),
    });

    function handleOnQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setQuery(e.target.value);
    }

    function search() {
        searchMutation.mutate({
            agentId: agent.id,
            query,
        });
    }

    function handleOnSearch() {
        if (!query) {
            return;
        }

        search();
    }

    function handleClearQuery() {
        setQuery(undefined);

        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }

        searchMutation.reset();
        onReset();
    }

    return (
        <div className="flex flex-row gap-2 me-auto w-1/3">
            <div className="grow relative">
                <Input
                    name="query"
                    placeholder="Search"
                    defaultValue={query}
                    onChange={handleOnQueryChange}
                    ref={searchInputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleOnSearch();
                        }
                    }}
                />
                {searchMutation.data && query && (
                    <Button
                        className="absolute top-1 right-1 size-7"
                        variant="ghost"
                        size="icon"
                        onClick={handleClearQuery}
                    >
                        <X />
                    </Button>
                )}
            </div>
            <Button
                variant="outline"
                onClick={handleOnSearch}
                loading={searchMutation.isPending}
            >
                Search
            </Button>
        </div>
    );
}
