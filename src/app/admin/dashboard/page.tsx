'use client'

import { useForm, Controller } from 'react-hook-form';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Button, TextField, Chip, Autocomplete } from '@mui/material';
import axios from 'axios';
import{ useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Descendant } from 'slate';
import { useQuery } from '@tanstack/react-query';

interface FormData {
    title: string;
    slug: string;
    content: Descendant[];
    tags: string[];
}

const fetchTags = async() => {
    const response = await axios.get('/api/tags');
    return response.data.map((tag: any) => tag.name);
}

const Dashboard: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const { control, handleSubmit, register } = useForm<FormData>({
        defaultValues: {
            title: '',
            slug: '',
            content: [
                {
                    type: 'paragraph',
                    children: [{ text: 'Start writing your post' }],
                }
            ],
            tags: [],
        }
    });
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post('/api/posts', {
                title: data.title,
                slug: data.slug,
                content: JSON.stringify(data.content),
                tags: data.tags,
            });
            alert('Post created successfully');
            router.push(`/posts/${response.data.slug}`);
        } catch (error) {
            console.error(error);
            alert('Error creating post.');
        }
    }

    const { data: tags } = useQuery({
        queryKey: ['tags'],
        queryFn: async() => fetchTags()
    });

    return (
        <div className='max-w-3xl mx-auto'>
            <h1 className='text-2xl mb-4'>Create New Post</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <TextField
                    label='Title'
                    fullWidth
                    {...register('title', { required: true })}
                />
                <TextField
                    label='Slug'
                    fullWidth
                    {...register('slug', { required: true})}
                />
                <Controller
                    control={control}
                    name='content'
                    render={({ field }) => (
                        <RichTextEditor value={field.value} onChange={field.onChange} />
                    )}
                />
                <Controller
                    control={control}
                    name='tags'
                    render={({ field }) => (
                        <Autocomplete
                            multiple
                            options={tags || []}
                            freeSolo
                            onChange={(event, newValue) => field.onChange(newValue)}
                            renderTags={(value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip
                                        variant='outlined'
                                        label={option}
                                        {...getTagProps({index})}
                                        key={option}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label='Tags' placeholder='Add tag'/>
                            )}
                        />
                    )}
                />
                <Button type='submit' variant='contained' color='primary'>
                    Create Post
                </Button>
            </form>
        </div>
    )
}

export default Dashboard;