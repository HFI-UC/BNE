import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

export type Article = {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  hero_image_url?: string;
  published_at?: string;
};

export type Announcement = {
  id: number;
  title: string;
  content: string;
  published_at: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  role: "student" | "mentor" | "admin";
};

export type Booking = {
  id: number;
  mentor_id: number;
  mentor_name: string;
  subject: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
};

export type Mentor = {
  id: number;
  name: string;
  bio?: string;
  subjects: string[];
  locations: string[];
  availability: Array<{ day: string; slots: string[] }>;
};

export type Resource = {
  id: number;
  title: string;
  description?: string;
  uploader_name?: string;
  original_filename: string;
  status: string;
  created_at: string;
};

export const useHomepageFeed = () =>
  useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        featured: Article[];
        latest: Article[];
        announcements: Announcement[];
      }>("/articles");
      return data;
    },
  });

export const useArchive = (page: number) =>
  useQuery({
    queryKey: ["archive", page],
    queryFn: async () => {
      const { data } = await apiClient.get("/articles/archive", {
        params: { page },
      });
      return data as {
        items: Article[];
        total: number;
        page: number;
        perPage: number;
      };
    },
    keepPreviousData: true,
  });

export const useArticle = (slug: string) =>
  useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ article: Article & { content: string } }>(
        `/articles/${slug}`,
      );
      return data.article;
    },
    enabled: Boolean(slug),
  });

export const useMentors = () =>
  useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ mentors: Mentor[] }>("/mentors");
      return data.mentors;
    },
  });

export const useBookings = () =>
  useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ bookings: Booking[] }>("/bookings");
      return data.bookings;
    },
  });

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      mentor_id: number;
      subject: string;
      location: string;
      start_time: string;
      end_time: string;
    }) => {
      const { data } = await apiClient.post<{ booking_id: number }>("/bookings", payload);
      return data.booking_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useResources = () =>
  useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ resources: Resource[] }>("/resources");
      return data.resources;
    },
  });

export const useMyResources = (enabled = true) =>
  useQuery({
    queryKey: ["my-resources"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ resources: Resource[] }>("/resources/mine");
      return data.resources;
    },
    enabled,
  });

export const usePendingResources = () =>
  useQuery({
    queryKey: ["pending-resources"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ resources: Resource[] }>("/admin/resources/pending");
      return data.resources;
    },
  });

export const useApproveResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "approve" | "reject" }) => {
      const endpoint = action === "approve" ? "approve" : "reject";
      await apiClient.post(`/admin/resources/${id}/${endpoint}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useAdminBookings = () =>
  useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ bookings: Booking[] }>("/admin/bookings");
      return data.bookings;
    },
  });

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiClient.patch(`/admin/bookings/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUploadResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; description?: string; file: File }) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      if (payload.description) {
        formData.append("description", payload.description);
      }
      formData.append("file", payload.file);
      await apiClient.post("/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["my-resources"] });
    },
  });
};

export const useDownloadResource = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.get<{ url: string }>(`/resources/${id}/download`);
      return data.url;
    },
  });

