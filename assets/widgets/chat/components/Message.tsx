import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";


interface ChatMessageProps {
    content: string;
    role: string;
}

export function Message(
    {content, role}: ChatMessageProps,
) {

    if (role === 'assistant') {
        // prevent interpretation as MD Quote
        content = content.replace(/"\n+>/g, '">');

        if(content.includes('<wg-')){
            console.log(content);
        }

        return <div className="prose">
            <Markdown
                skipHtml={false}
                rehypePlugins={[rehypeRaw]}
                disallowedElements={['blockquote']}
            >{content}</Markdown>
        </div>
    }

    return (
        <p className="bg-primary text-background p-2 px-4 rounded-lg self-end">
            {content}
        </p>
    );
}
