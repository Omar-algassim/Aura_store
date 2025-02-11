import type { Schema, Struct } from '@strapi/strapi';

export interface ImagesImages extends Struct.ComponentSchema {
  collectionName: 'components_images_images';
  info: {
    description: '';
    displayName: 'images';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LocationDeliveryAddress extends Struct.ComponentSchema {
  collectionName: 'components_location_delivery_addresses';
  info: {
    displayName: 'Delivery Address';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    region: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LocationLocation extends Struct.ComponentSchema {
  collectionName: 'components_location_locations';
  info: {
    displayName: 'Location';
    icon: 'earth';
  };
  attributes: {
    address: Schema.Attribute.String;
    city: Schema.Attribute.String;
    region: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'images.images': ImagesImages;
      'location.delivery-address': LocationDeliveryAddress;
      'location.location': LocationLocation;
    }
  }
}
