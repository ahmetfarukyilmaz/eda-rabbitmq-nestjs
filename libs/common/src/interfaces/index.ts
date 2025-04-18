export interface IRabbitRequest {
  fields: {
    consumerTag: string;
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
  properties: {
    headers: {
      requestId?: string;
      [key: string]: any;
    };
  };
  content: {
    type: string;
    data: number[];
  };
}

export interface RequestContext {
  requestId: string;
}
