export class User {
  documentId: string;
  username: string;
  email?: string;
  phone_number?: string;
  country_code?: string;
  location?: {
    region: string;
    city: string;
    address: string;
  };

  blocked?: boolean;
  confirmed?: boolean;
  createdAt?: string;
  id?: number;
  provider?: null;
  publishedAt?: string;
  updatedAt?: string;

  constructor(userParams: User | null = null) {
    this.documentId = userParams?.documentId || "";
    this.username = userParams?.username || "anonymous";
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
