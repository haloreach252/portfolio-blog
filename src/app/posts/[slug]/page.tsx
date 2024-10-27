'use client'

import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from "react";
import Head from 'next/head';
import { Box, CircularProgress, Typography } from "@mui/material";

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    tags: { name: string }[];
    created_at: string;
}

const fetchPost = async (slug: string): Promise<Post> => {
    const { data } = await axios.get(`/api/posts/${slug}`);
    return data;
}

const PostPage: React.FC = () => {
    const router = useRouter();
    const [slug, setSlug] = useState<string>('');
    const { data: post, isLoading, error } = useQuery<Post>({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
        enabled: !!slug
    })

    useEffect(() => {
        // Extract slug from URL
        const path = window.location.pathname;
        const slugFromPath = path.split('/').pop() || '';
        setSlug(slugFromPath);
    }, []);

    if (isLoading) {
        return (
            <Box className='container flex justify-center items-center'>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box className='container'>
                <Typography>
                    Error loading post.
                </Typography>
            </Box>
        )
    }

    if (!post) {
        return (
            <Box className='container'>
                <Typography>
                    Post not found.
                </Typography>
            </Box>
        )
    }

    return (
        <>
            <Head>
                <title>{post.title} | Miniverse Blog</title>
                <meta name='description' content={post.content.substring(0, 150)} />
            </Head>
            <article className="prose lg:prose-xl">
                <h1>{post.title}</h1>
                <ReactMarkdown>{post.content}</ReactMarkdown>
                <div className="mt-4">
                    {post.tags.map((tag) => (
                        <span key={tag.name} className="badge bg-blue-500 text-white mr-2">
                            {tag.name}
                        </span>
                    ))}
                </div>
            </article>
        </>
    )
}

export default PostPage;