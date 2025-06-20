export class User {
  documentId: string;
  username: string;
  avatar?: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  location?: {
    region: string;
    city: string;
    address: string;
  };
  role: {
    id: number;
    documentId: string;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  blocked?: boolean;
  confirmed?: boolean;
  emailConfirmed?: boolean;
  phoneConfirmed?: boolean;
  createdAt?: string;
  id?: number;
  provider?: null;
  publishedAt?: string;
  updatedAt?: string;

  constructor(userParams: User | null = null) {
    this.documentId = userParams?.documentId || '';
    this.username = userParams?.username || 'anonymous';
    this.role = userParams?.role || {
      id: 0,
      documentId: '',
      name: 'public',
      description: '',
      type: '',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    };
    this.avatar = userParams?.avatar || '/images/default-avatar.png';
    this.email = userParams?.email;
    this.phone_number = userParams?.phone_number;
    this.country_code = userParams?.country_code;
    this.location = userParams?.location;
    this.blocked = userParams?.blocked;
    this.confirmed = userParams?.confirmed;
    this.createdAt = userParams?.createdAt;
    this.id = userParams?.id;
    this.provider = userParams?.provider;
    this.publishedAt = userParams?.publishedAt;
    this.updatedAt = userParams?.updatedAt;
  }
}
