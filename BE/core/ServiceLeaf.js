import { ServiceComponent } from "./ServiceComponent.js";

export class ServiceLeaf extends ServiceComponent {
  constructor(service) {
    super();
    this.service = service;
  }

  getCost() {
    return this.service.cost;
  }

  getDetails() {
    return {
      id: this.service._id,
      serviceName: this.service.serviceName,
      description: this.service.description,
      cost: this.service.cost,
      isActive: this.service.isActive,
      type: "single",
    };
  }
}