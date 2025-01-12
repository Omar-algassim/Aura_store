export class User {
  documentId: string;
  username: string;
  email?: string;
  phone_number?: string;
  location?: string;

  blocked?: boolean;
  confirmed?: boolean;
  createdAt?: string;
  id?: number;
  provider?: null;
  publishedAt?: string;
  updatedAt?: string;

  constructor(
    documentId: string = "",
    username: string = "anonymous",
    email: string = "",
    phone_number: string = "",
    location: string = "",
    blocked: boolean = false,
    confirmed: boolean = false,
    createdAt: string = "",
    id: number = 0,
    provider: null = null,
    publishedAt: string = "",
    updatedAt: string = ""
  ) {
    this.documentId = documentId;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.location = location;
    this.blocked = blocked;
    this.confirmed = confirmed;
    this.createdAt = createdAt;
    this.id = id;
    this.provider = provider;
    this.publishedAt = publishedAt;
    this.updatedAt = updatedAt;
  }
}
