import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { createPost, deletePost, updatePost, getAllPosts, uploadMediaToCloudinary } from "../../../api/posts";
import { motion, AnimatePresence } from 'framer-motion'; // animation
import { Loader2 } from 'lucide-react'; // spinning icon


const CLOUDINARY_UPLOAD_PRESET = "first_cloudinary";
const CLOUDINARY_CLOUD_NAME = "detnvovel";

async function uploadToCloudinary(file: File): Promise<string> {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    throw new Error("Failed to upload media to Cloudinary");
  }

  const result = await res.json();
  return result.secure_url;
}


const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showLoader, setShowLoader] = useState(true);


  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentType: 'text',
    mediaCaption: '',
    authorName: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => getAllPosts(),
    enabled: isAdmin,
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      let mediaUrl = '';

      if (mediaFile) {
        mediaUrl = await uploadMediaToCloudinary(mediaFile);
      }
      return createPost({
        ...postData,
        mediaUrl,
        authorName: formData.authorName || user?.displayName || user?.email || 'Admin',
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
        mediaUrl = await uploadMediaToCloudinary(mediaFile);
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

  useEffect(() => {
    if (!user) {
      navigate("/admin/login");
    } else if (!isAdmin) {
      navigate("/");
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1500); // 1.5 sec splash screen
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, navigate]);



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

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast({ title: 'Post deleted successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete post error:', error);
    }
  });


  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  if (!isAdmin || showLoader) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-sky-blue to-sky-700 dark:from-charcoal dark:to-charcoal/90">
        <motion.div
          className="text-white flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Loader2 className="h-10 w-10 mb-4 animate-spin text-white" />
          <motion.h1
            className="text-xl font-semibold font-devanagari tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Admin Dashboard Loading...
          </motion.h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal transition-colors duration-500">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold font-devanagari text-gray-900 dark:text-white transition-colors duration-300">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Manage your motivational content effortlessly ✨
              </p>
            </div>

            <Button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 dark:from-teal-500 dark:to-teal-700 text-white font-medium hover:scale-105 transition-transform duration-300 shadow-md"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Post
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create/Edit Post Form */}
            {isCreating && (
              <motion.div
                className="lg:col-span-2 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="font-devanagari text-2xl text-gray-800 dark:text-white">
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                      {editingPost ? 'Update your post' : 'Add new motivational content'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Content Type */}
                      <div>
                        <Label htmlFor="contentType">Content Type</Label>
                        <Select
                          value={formData.contentType}
                          onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a type" />
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

                      {/* Title */}
                      <div>
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter post title..."
                          className="mt-1"
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Write your motivational content in Hindi..."
                          rows={6}
                          className="mt-1 font-devanagari"
                        />
                      </div>

                      {/* Media Upload */}
                      {(formData.contentType === 'image' || formData.contentType === 'video') && (
                        <div className="space-y-3">
                          <Label htmlFor="media" className="text-base font-semibold text-gray-700 dark:text-gray-200">
                            Upload {formData.contentType === 'image' ? 'Image' : 'Video'}
                          </Label>

                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-white/40 dark:bg-gray-800/40 transition-all duration-300 hover:shadow-md">
                            {/* Upload icon */}
                            <div className="text-4xl mb-2 text-sky-600 dark:text-teal-400 animate-bounce">
                              📁
                            </div>

                            {/* Upload Info */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                              Drag & drop your {formData.contentType}, or
                            </p>

                            {/* Custom Upload Button */}
                            <button
                              type="button"
                              onClick={() => document.getElementById('media')?.click()}
                              className="inline-block px-4 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors duration-200"
                            >
                              Select File
                            </button>

                            <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                              Supported: {formData.contentType === 'image' ? 'JPG, PNG, WEBP' : 'MP4, MOV'}
                            </span>

                            {/* Hidden File Input */}
                            <input
                              id="media"
                              type="file"
                              accept={formData.contentType === 'image' ? 'image/*' : 'video/*'}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      )}
                      {/* Media Caption */}
                      {(formData.contentType === 'image' || formData.contentType === 'video') && (
                        <div>
                          <Label htmlFor="mediaCaption">Media Caption (Optional)</Label>
                          <Input
                            id="mediaCaption"
                            value={formData.mediaCaption}
                            onChange={(e) => setFormData({ ...formData, mediaCaption: e.target.value })}
                            placeholder="Enter media caption..."
                            className="mt-1 font-devanagari"
                          />
                        </div>
                      )}

                      {/* Author Name */}
                      <div>
                        <Label htmlFor="authorName">Author Name</Label>
                        <Input
                          id="authorName"
                          value={formData.authorName}
                          onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                          placeholder="Enter author name..."
                          className="mt-1"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-4">
                        <Button
                          type="submit"
                          disabled={createPostMutation.isPending || updatePostMutation.isPending}
                          className="bg-sky-blue dark:bg-teal hover:bg-sky-blue/90 dark:hover:bg-teal/90 transition-all"
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
                          className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* Posts List */}
            <div className={isCreating ? 'lg:col-span-1' : 'lg:col-span-3'}>
              <Card className="h-full shadow-md">
                <CardHeader>
                  <CardTitle className="font-devanagari">Your Posts</CardTitle>
                  <CardDescription>{posts?.length || 0} posts published</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1 space-y-2">
                            <div className="w-3/4 h-4 bg-muted rounded" />
                            <div className="w-1/2 h-3 bg-muted rounded" />
                          </div>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-muted rounded" />
                            <div className="w-8 h-8 bg-muted rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : posts && posts.length > 0 ? (
                    <motion.div
                      layout
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <AnimatePresence>
                        {posts.map((post) => (
                          <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold font-devanagari line-clamp-1">
                                {post.title || 'Untitled Post'}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {(post.contentType
                                  ? post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)
                                  : 'Unknown')}{' '}
                                • {post.content?.substring(0, 50) || ''}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEdit(post)}
                                className="hover:bg-primary/10"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDelete(post.id)}
                                disabled={deletePostMutation.isPending}
                                className="hover:bg-destructive/10"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-center py-10"
                    >
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-muted-foreground">No posts yet.</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create your first post to get started!
                      </p>
                    </motion.div>
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
