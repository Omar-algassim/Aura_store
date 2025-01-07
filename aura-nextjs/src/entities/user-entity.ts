export class User {
  documentId: string;
  username: string;
  email?: string;
  phone_number?: string;
  location?: string;

  constructor(
    documentId: string = "",
    username: string = "anonymous",
    email: string = "",
    phone_number: string = "",
    location: string = ""
  ) {
    this.documentId = documentId;
    this.username = username;
    this.email = email;
    this.phone_number = phone_number;
    this.location = location;
  }
}
