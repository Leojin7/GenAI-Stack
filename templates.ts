import { Edge } from 'reactflow';
import { Stack, CustomNode, ComponentType } from './src/types';

interface BaseNodeTemplate {
    type: ComponentType;
    position: { x: number; y: number };
    data: Record<string, any>;
}

const baseNodeTemplates: Record<ComponentType, Omit<BaseNodeTemplate, 'id'>> = {
    userQuery: {
        type: 'userQuery',
        position: { x: 0, y: 0 },
        data: { query: '' }
    },
    knowledgeBase: {
        type: 'knowledgeBase',
        position: { x: 0, y: 0 },
        data: { fileName: null }
    },
    llm: {
        type: 'llm',
        position: { x: 0, y: 0 },
        data: { prompt: 'User Query: {query}', webSearchEnabled: false }
    },
    output: {
        type: 'output',
        position: { x: 0, y: 0 },
        data: { result: null, isLoading: false }
    }
};

export const defaultNewStack: Omit<Stack, 'id' | 'name' | 'description'> = {
    nodes: [
        {
            id: '1',
            type: 'userQuery',
            position: { x: 50, y: 200 },
            data: {
                query: "Write a short story about a robot who discovers music.",
                onChange: undefined,
                onDelete: undefined
            }
        },
        {
            id: '3',
            type: 'llm',
            position: { x: 450, y: 200 },
            data: {
                prompt: "User Query: {query}",
                webSearchEnabled: false,
                onChange: undefined,
                onDelete: undefined
            }
        },
        {
            id: '4',
            type: 'output',
            position: { x: 850, y: 200 },
            data: {
                result: '',
                isLoading: false,
                onChange: undefined,
                onDelete: undefined
            }
        },
    ],
    edges: [
        { id: 'e1-3', source: '1', target: '3', sourceHandle: 'query' },
        { id: 'e3-4', source: '3', target: '4', sourceHandle: 'output', targetHandle: 'output' },
    ]
};


export const initialStackTemplates: Stack[] = [
    {
        id: 'stack-1',
        name: 'Chat With AI',
        description: 'Chat with a smart AI using a knowledge base.',
        nodes: [
            {
                id: '1',
                type: 'userQuery',
                position: { x: 50, y: 200 },
                data: {
                    query: "What is the main theme of 'A Midsummer Night's Dream'?",
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '2',
                type: 'knowledgeBase',
                position: { x: 450, y: 100 },
                data: {
                    fileName: 'MidsummerNightsDream.pdf',
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '3',
                type: 'llm',
                position: { x: 850, y: 0 },
                data: {
                    prompt: "You are a helpful PDF assistant.\n\nCONTEXT: {context}\nUser Query: {query}",
                    webSearchEnabled: false,
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '4',
                type: 'output',
                position: { x: 1300, y: 250 },
                data: {
                    result: '',
                    isLoading: false,
                    onChange: undefined,
                    onDelete: undefined
                }
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'query', targetHandle: 'query' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'context', targetHandle: 'context' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'output', targetHandle: 'output' },
        ]
    },
    {
        id: 'stack-2',
        name: 'Content Writer',
        description: 'Helps you write content based on a simple prompt.',
        nodes: [
            {
                id: '1',
                type: 'userQuery',
                position: { x: 50, y: 200 },
                data: {
                    query: 'Write a blog post about the benefits of meditation',
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '3',
                type: 'llm',
                position: { x: 450, y: 200 },
                data: {
                    prompt: 'Write a well-structured blog post about: {query}',
                    webSearchEnabled: false,
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '4',
                type: 'output',
                position: { x: 850, y: 200 },
                data: {
                    result: '',
                    isLoading: false,
                    onChange: undefined,
                    onDelete: undefined
                }
            },
        ],
        edges: [
            { id: 'e1-3', source: '1', target: '3', sourceHandle: 'query' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'output', targetHandle: 'output' },
        ]
    },
    {
        id: 'stack-3',
        name: 'Content Summarizer',
        description: 'Helps you summarize content from a knowledge base file.',
        nodes: [
            {
                id: '1',
                type: 'knowledgeBase',
                position: { x: 50, y: 100 },
                data: {
                    fileName: 'ResearchPaper.pdf',
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '2',
                type: 'llm',
                position: { x: 450, y: 100 },
                data: {
                    prompt: 'Summarize the following content in 3-5 bullet points:\n\n{context}',
                    webSearchEnabled: false,
                    onChange: undefined,
                    onDelete: undefined
                }
            },
            {
                id: '3',
                type: 'output',
                position: { x: 850, y: 100 },
                data: {
                    result: '',
                    isLoading: false,
                    onChange: undefined,
                    onDelete: undefined
                }
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'context', targetHandle: 'context' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'output', targetHandle: 'output' },
        ]
    },
    {
        id: 'stack-4',
        name: 'Information Finder',
        description: 'Helps you find relevant information from the web.',
        nodes: [
            { id: '1', type: 'userQuery', position: { x: 50, y: 200 }, data: { query: "Who won the last FIFA world cup?" } },
            { id: '3', type: 'llm', position: { x: 450, y: 200 }, data: { prompt: "Use your web search tool to answer the user's query.\n\nUser Query: {query}", webSearchEnabled: true } },
            { id: '4', type: 'output', position: { x: 850, y: 200 }, data: { result: '', isLoading: false } },
        ],
        edges: [
            { id: 'e1-3', source: '1', target: '3', sourceHandle: 'query' },
            { id: 'e3-4', source: '3', target: '4', sourceHandle: 'output', targetHandle: 'output' },
        ]
    }
];
