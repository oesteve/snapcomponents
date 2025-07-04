import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/articles')({
    component: About,
})

function About() {
    return <div className="p-2">Hello from Articles</div>
}
