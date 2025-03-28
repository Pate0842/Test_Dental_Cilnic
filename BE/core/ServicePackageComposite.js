import { ServiceComponent } from "./ServiceComponent.js";

export class ServicePackageComposite extends ServiceComponent {
  constructor(packageName) {
    super();
    this.packageName = packageName;
    this.components = [];
  }

  add(component) {
    this.components.push(component);
  }

  remove(component) {
    const index = this.components.findIndex((comp) => comp.service?._id === component.service?._id);
    if (index !== -1) this.components.splice(index, 1);
  }

  getCost() {
    return this.components.reduce((total, comp) => total + comp.getCost(), 0);
  }

  getDetails() {
    return {
      packageName: this.packageName,
      components: this.components.map((comp) => comp.getDetails()),
      totalCost: this.getCost(),
      type: "package",
    };
  }
}