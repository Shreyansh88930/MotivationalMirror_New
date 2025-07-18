import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Image, Video, FileText, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPosts, createPost, updatePost, deletePost, uploadMedia } from '../lib/firebase';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentType: 'text',
    mediaCaption: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => getPosts(),
    enabled: isAdmin,
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      let mediaUrl = '';
      if (mediaFile) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${mediaFile.name}`;
        mediaUrl = await uploadMedia(mediaFile, `posts/${fileName}`);
      }
      
      return createPost({
        ...postData,
        mediaUrl,
        authorName: user?.displayName || user?.email || 'Admin',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
      console.error('Create post error:', error);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, postData }: { postId: string; postData: any }) => {
      let mediaUrl = editingPost?.mediaUrl;
      if (mediaFile) {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${mediaFile.name}`;
        mediaUrl = await uploadMedia(mediaFile, `posts/${fileName}`);
      }
      
      return updatePost(postId, {
        ...postData,
        mediaUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Post updated successfully!',
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive',
      });
      console.error('Update post error:', error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Post deleted successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete post error:', error);
    },
  });

  React.useEffect(() => {
    if (!user) {
      setLocation('/admin/login');
    } else if (!isAdmin) {
      setLocation('/');
    }
  }, [user, isAdmin, setLocation]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      contentType: 'text',
      mediaCaption: '',
    });
    setMediaFile(null);
    setMediaPreview(null);
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content && !mediaFile) {
      toast({
        title: 'Error',
        description: 'Please provide content or media for the post.',
        variant: 'destructive',
      });
      return;
    }

    if (editingPost) {
      updatePostMutation.mutate({
        postId: editingPost.id,
        postData: formData,
      });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      contentType: post.contentType,
      mediaCaption: post.mediaCaption || '',
    });
    setMediaPreview(post.mediaUrl);
    setIsCreating(true);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-devanagari">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your motivational content
              </p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-sky-blue dark:bg-teal hover:bg-sky-blue/90 dark:hover:bg-teal/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create/Edit Post Form */}
            {isCreating && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-devanagari">
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </CardTitle>
                    <CardDescription>
                      {editingPost ? 'Update your post' : 'Add new motivational content'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="contentType">Content Type</Label>
                        <Select
                          value={formData.contentType}
                          onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">
                              <div className="flex items-center gap-2">
                                <FileText size={16} />
                                Text
                              </div>
                            </SelectItem>
                            <SelectItem value="image">
                              <div className="flex items-center gap-2">
                                <Image size={16} />
                                Image
                              </div>
                            </SelectItem>
                            <SelectItem value="video">
                              <div className="flex items-center gap-2">
                                <Video size={16} />
                                Video
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter post title..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Write your motivational content in Hindi..."
                          rows={6}
                          className="font-devanagari"
                        />
                      </div>

                      {(formData.contentType === 'image' || formData.contentType === 'video') && (
                        <div>
                          <Label htmlFor="media">Upload Media</Label>
                          <Input
                            id="media"
                            type="file"
                            accept={formData.contentType === 'image' ? 'image/*' : 'video/*'}
                            onChange={handleFileChange}
                            className="cursor-pointer"
                          />
                          {mediaPreview && formData.contentType === 'image' && (
                            <div className="mt-4">
                              <img
                                src={mediaPreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {(formData.contentType === 'image' || formData.contentType === 'video') && (
                        <div>
                          <Label htmlFor="mediaCaption">Media Caption (Optional)</Label>
                          <Input
                            id="mediaCaption"
                            value={formData.mediaCaption}
                            onChange={(e) => setFormData({ ...formData, mediaCaption: e.target.value })}
                            placeholder="Enter media caption..."
                            className="font-devanagari"
                          />
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          disabled={createPostMutation.isPending || updatePostMutation.isPending}
                          className="bg-sky-blue dark:bg-teal hover:bg-sky-blue/90 dark:hover:bg-teal/90"
                        >
                          {createPostMutation.isPending || updatePostMutation.isPending ? (
                            <>
                              <Upload className="mr-2 h-4 w-4 animate-spin" />
                              {editingPost ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              {editingPost ? 'Update Post' : 'Create Post'}
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Posts List */}
            <div className={isCreating ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-devanagari">Your Posts</CardTitle>
                  <CardDescription>
                    {posts?.length || 0} posts published
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : posts && posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold font-devanagari">
                              {post.title || 'Untitled Post'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)} • {' '}
                              {post.content?.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(post.id)}
                              disabled={deletePostMutation.isPending}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Create your first post to get started!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
