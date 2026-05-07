export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMPANY' | 'SEEKER';
  image?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  icon?: string;
  _count?: { jobs: number };
}

export interface ICompany {
  id: string;
  userId: string;
  companyName: string;
  logo?: string;
  website?: string;
  location?: string;
  industry?: string;
  description?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionNote?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  _count?: { jobs: number };
}

export interface IJob {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'REMOTE' | 'CONTRACT' | 'INTERNSHIP';
  salaryMin?: number;
  salaryMax?: number;
  deadline?: string;
  isActive: boolean;
  createdAt: string;
  companyId: string;
  categoryId: string;
  company?: {
    id: string;
    companyName: string;
    logo?: string;
    location?: string;
  };
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  _count?: { applications: number };
}

export interface IApplication {
  id: string;
  jobId: string;
  userId: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  createdAt: string;
  job?: IJob;
  user?: IUser;
}

export interface ISavedJob {
  id: string;
  jobId: string;
  userId: string;
  createdAt: string;
  job?: IJob;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: IPaginationMeta;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}